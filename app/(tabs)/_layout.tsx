import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { COLORS } from "@/constants/theme"
import { useAuth } from "@clerk/clerk-expo"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Image } from "expo-image"
import { Text, View } from "react-native"
export default function TabLayout() {
	const { userId } = useAuth()
	const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip")

	const notifications = useQuery(api.notifications.getNotifications)
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				headerShown: false,
				tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: COLORS.grey,
				tabBarStyle: {
					backgroundColor: "black",
					borderTopWidth: 0,
					position: "absolute",
					elevation: 0,
					height: 40,
					paddingBottom: 8,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarIcon: ({ size, color }) => <Ionicons name="home" size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="bookmarks"
				options={{
					tabBarIcon: ({ size, color }) => <Ionicons name="bookmark" size={size} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="create"
				options={{
					tabBarIcon: ({ size, color }) => <Ionicons name="add-circle" size={size} color={COLORS.primary} />,
				}}
			/>
			<Tabs.Screen
				name="notifications"
				options={{
					tabBarIcon: ({ size, color }) => {
						if (notifications === undefined || notifications.length === 0) return <Ionicons name="heart" size={size} color={color} />
						return (
							<View style={{ position: "relative" }}>
								<Ionicons name="heart" size={size} color={color} />
								<Text style={{ position: "absolute", top: -5, right: -16, fontSize: 11, color: "red", fontWeight: "bold" }}>
									+{notifications.length}
								</Text>
							</View>
						)
					},
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					tabBarIcon: ({ size, color }) => {
						if (!currentUser) return <Ionicons name="person-circle" size={size} color={color} />
						return (
							<View style={{ borderColor: COLORS.primary, borderWidth: 2, borderRadius: 100 }}>
								<Image source={currentUser.image} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" transition={200} />
							</View>
						)
					},
				}}
			/>
		</Tabs>
	)
}
