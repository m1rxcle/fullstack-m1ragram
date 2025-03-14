import Loader from "@/components/Loader"
import NoNotificationsFound from "@/components/empty-pages/NoNotificationsFound"
import { api } from "@/convex/_generated/api"
import { styles } from "@/styles/notifications.styles"
import { useMutation, useQuery } from "convex/react"
import { View, Text, FlatList } from "react-native"

import NotificationIcon from "@/components/NotificationIcon"
import { COLORS } from "@/constants/theme"
import { Ionicons } from "@expo/vector-icons"
import { useCallback, useEffect } from "react"
import { useUser } from "@clerk/clerk-expo"
import { useFocusEffect } from "@react-navigation/native"
export default function Notifications() {
	const { user } = useUser()
	const notifications = useQuery(api.notifications.getNotifications)
	const clearNotifications = useMutation(api.notifications.clearNotifications)

	useFocusEffect(
		useCallback(() => {
			return () => {
				clearNotifications({
					userId: user?.id,
				})
			}
		}, [])
	)

	if (notifications === undefined) return <Loader />

	if (notifications.length === 0) return <NoNotificationsFound />

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Уведомления</Text>
				<Ionicons name="leaf" size={24} color={COLORS.primary} />
			</View>
			<FlatList
				data={notifications}
				renderItem={({ item }) => <NotificationIcon notification={item} />}
				keyExtractor={(item) => item._id}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.listContainer}
			/>
		</View>
	)
}
