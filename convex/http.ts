import { httpRouter } from "convex/server"

import { httpAction } from "./_generated/server"
import { api } from "./_generated/api"

import { Webhook } from "svix"

const http = httpRouter()

//1-we need to make sure that the webhook event is coming from clerk
//2-if so, we will listen for the user.created event
//3-we will save the user to our database

http.route({
	path: "/clerk-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

		if (!webhookSecret) {
			throw new Error("Missing Webhook Secret env.")
		}
		const svix_id = request.headers.get("svix-id")
		const svix_signature = request.headers.get("svix-signature")
		const svix_timestamp = request.headers.get("svix-timestamp")

		if (!svix_id || !svix_signature || !svix_timestamp) {
			return new Response("Error occurred -- no svix headers", { status: 400 })
		}
		console.log("Received webhook with headers:", request.headers)
		const payload = await request.json()
		const body = JSON.stringify(payload)
		console.log("Payload received:", payload)

		const wh = new Webhook(webhookSecret)
		let evt: any
		//verify webhook
		try {
			evt = wh.verify(body, {
				"svix-id": svix_id,
				"svix-timestamp": svix_timestamp,
				"svix-signature": svix_signature,
			}) as any
			console.log("Verified webhook event:", evt) // Добавили лог для успешного результата
		} catch (error) {
			console.error("Error verifying webhook: ", error)
			return new Response("Error occurred", { status: 400 })
		}
		const eventType = evt.type
		console.log("Event type:", eventType) // Логируем тип события
		if (eventType === "user.created") {
			const { id, email_addresses, first_name, last_name, image_url } = evt.data
			console.log(evt.data)
			const email = email_addresses[0].email_address

			console.log("Email:", email)
			const name = `${first_name || ""} ${last_name || ""}`.trim()
			try {
				await ctx.runMutation(api.users.createUser, {
					email,
					fullname: name,
					image: image_url,
					clerkId: id,
					username: email.split("@")[0],
				})
				console.log("User created successfully") // Логируем успешное создание пользователя
			} catch (error: any) {
				console.log(error.stack)
				console.log("Error creating user: ", error)
				return new Response("Error creating user", { status: 400 })
			}
		}
		return new Response("Webhook processed successfully", { status: 200 })
	}),
})

export default http
