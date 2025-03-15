import { ScrollView } from "react-native"

import Story from "./Story"

import { styles } from "@/styles/feed.styles"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import NoStoryAvailable from "./empty-pages/NoStoryAvailable"

export default function StoriesSection() {
	const following = useQuery(api.users.getFollowing)

	if (following === undefined) return <NoStoryAvailable />
	return (
		<ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.storiesContainer}>
			{following.map((user) => (
				<Story user={user} key={user._id} />
			))}
		</ScrollView>
	)
}
