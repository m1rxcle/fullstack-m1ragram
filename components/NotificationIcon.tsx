import { View, TouchableOpacity, Text } from "react-native"

import { Link } from "expo-router"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"

import { Id } from "@/convex/_generated/dataModel"

import { formatDistanceToNow } from "date-fns"

import { COLORS } from "@/constants/theme"
import { styles } from "@/styles/notifications.styles"

type NotificationProps = {
	notification: {
		sender: {
			_id: Id<"users">
			username: string
			image: string
		}
		post: {
			userId: Id<"users">
			imageUrl: string
		} | null

		type: "like" | "follow" | "unfollow" | "comment"
		comment: string | undefined
		_creationTime: number
	}
}

export default function NotificationIcon({ notification }: NotificationProps) {
	return (
		<View style={styles.notificationItem}>
			<View style={styles.notificationContent}>
				<Link href={`/user/${notification.sender._id}`} asChild>
					<TouchableOpacity style={styles.avatarContainer}>
						<Image source={notification.sender.image} style={styles.avatar} contentFit="cover" transition={200} />
						<View style={styles.iconBadge}>
							{notification.type === "like" ? (
								<Ionicons name="heart" size={14} color={COLORS.primary} />
							) : notification.type === "follow" ? (
								<Ionicons name="person-add" size={14} color="#8B5CF6" />
							) : notification.type === "unfollow" ? (
								<Ionicons name="person-remove" size={14} color="#FF0000" />
							) : (
								<Ionicons name="chatbubble" size={14} color="#3B82F6" />
							)}
						</View>
					</TouchableOpacity>
				</Link>

				<View style={styles.notificationInfo}>
					<Link href={`/user/${notification.sender._id}`} asChild>
						<TouchableOpacity>
							<Text style={styles.username}>{notification.sender.username}</Text>
						</TouchableOpacity>
					</Link>

					<Text style={styles.action}>
						{notification.type === "follow"
							? "Подписался на вас"
							: notification.type === "like"
								? "Лайкнул ваш пост"
								: notification.type === "unfollow"
									? "Отписался от вас"
									: `Прокоментировал: "${notification.comment}" `}
					</Text>
					<Text style={styles.timeAgo}>{formatDistanceToNow(notification._creationTime, { addSuffix: true })}</Text>
				</View>
			</View>

			{notification.post && <Image source={notification.post.imageUrl} style={styles.postImage} contentFit="cover" transition={200} />}
		</View>
	)
}
