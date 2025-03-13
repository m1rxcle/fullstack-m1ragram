import { ScrollView } from "react-native"

import Story from "./Story"

import { styles } from "@/styles/feed.styles"
import { STORIES } from "@/constants/mock-data"

export default function StoriesSection() {
	return (
		<ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.storiesContainer}>
			{STORIES.map((story) => (
				<Story key={story.id} story={story} />
			))}
		</ScrollView>
	)
}
