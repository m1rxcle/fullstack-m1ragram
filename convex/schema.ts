import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	users: defineTable({
		username: v.string(), //m1rxcle
		fullname: v.string(), //Denis Morev
		email: v.string(), //usermail@example.com
		bio: v.optional(v.string()), //Hello im Denis
		image: v.string(), //Image for profile
		followers: v.number(), //0 or 10
		following: v.number(), //0 or 10
		posts: v.number(), //0 or 10
		clerkId: v.string(), //clerk id from clerk
	}).index("by_clerk_id", ["clerkId"]),
	posts: defineTable({
		userId: v.id("users"),
		imageUrl: v.string(),
		storageId: v.id("_storage"),
		caption: v.optional(v.string()),
		likes: v.number(),
		comments: v.number(),
	}).index("by_user", ["userId"]),

	likes: defineTable({
		userId: v.id("users"),
		postId: v.id("posts"),
	})
		.index("by_post", ["postId"])
		.index("by_user_and_post", ["userId", "postId"]),

	comments: defineTable({
		userId: v.id("users"),
		postId: v.id("posts"),
		content: v.string(),
	}).index("by_post", ["postId"]),
	follows: defineTable({
		followerId: v.id("users"),
		followingId: v.id("users"),
	})
		.index("by_follower", ["followerId"])
		.index("by_following", ["followingId"])
		.index("by_both", ["followerId", "followingId"]),

	notifications: defineTable({
		receiverId: v.id("users"),
		senderId: v.id("users"),
		type: v.union(v.literal("like"), v.literal("comment"), v.literal("follow")),
		postId: v.optional(v.id("posts")),
		commentId: v.optional(v.id("comments")),
	})
		.index("by_receiver", ["receiverId"])
		.index("by_post", ["postId"]),
	bookmarks: defineTable({
		userId: v.id("users"),
		postId: v.id("posts"),
	})
		.index("by_user", ["userId"])
		.index("by_post", ["postId"])
		.index("by_user_and_post", ["userId", "postId"]),
})
