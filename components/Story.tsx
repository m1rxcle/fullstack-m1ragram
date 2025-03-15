import { View, Text, TouchableOpacity, Image } from "react-native"

import { styles } from "@/styles/feed.styles"
import { Id } from "@/convex/_generated/dataModel"

type UserProps = {
	user:
		| {
				username: string | undefined
				image: string | undefined
				_id: Id<"follows">
				_creationTime: number
				followerId: Id<"users">
				followingId: Id<"users">
		  }
		| {
				_id: Id<"users">
				username: string
				image: string
		  }
}
export default function Story({ user }: UserProps) {
	return (
		<TouchableOpacity style={styles.storyWrapper}>
			<View style={styles.storyRing}>
				<Image source={{ uri: user.image }} style={styles.storyAvatar} />
			</View>
			<Text style={styles.storyUsername}>{user.username}</Text>
		</TouchableOpacity>
	)
}
