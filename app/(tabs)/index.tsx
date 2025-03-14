import { FlatList, RefreshControl, Text, View } from "react-native"

import { Ionicons } from "@expo/vector-icons"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

import Loader from "@/components/Loader"
import Post from "@/components/Post"
import StoriesSection from "@/components/StoriesSection"
import NoPostsFound from "@/components/empty-pages/NoPostsFound"

import { COLORS } from "@/constants/theme"
import { styles } from "@/styles/feed.styles"
import { useState } from "react"

export default function Index() {
	const [refreshing, setRefreshing] = useState(false)

	const posts = useQuery(api.posts.getFeedPosts)

	if (posts === undefined) return <Loader />

	if (posts.length === 0) return <NoPostsFound />

	//TODO: Add pull to refresh
	const onRefresh = () => {
		setRefreshing(true)
		setTimeout(() => {
			setRefreshing(false)
		}, 2000)
	}
	return (
		<View style={styles.container}>
			{/* Header section */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>m1ragram</Text>
				<Ionicons name="leaf" size={24} color={COLORS.primary} />
			</View>

			<FlatList
				data={posts}
				renderItem={({ item }) => <Post post={item} />}
				keyExtractor={(item) => item._id}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 60 }}
				ListHeaderComponent={<StoriesSection />}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
			/>
		</View>
	)
}
