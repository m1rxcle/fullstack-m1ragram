import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native"

import { Ionicons } from "@expo/vector-icons"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

import { useAuth } from "@clerk/clerk-expo"

import Loader from "@/components/Loader"
import Post from "@/components/Post"
import StoriesSection from "@/components/StoriesSection"
import NoPostsFound from "@/components/NoPostsFound"

import { COLORS } from "@/constants/theme"
import { styles } from "@/styles/feed.styles"
import { useState } from "react"

export default function Index() {
	const { signOut } = useAuth()
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
				<TouchableOpacity onPress={() => signOut()}>
					<Ionicons name="log-out-outline" size={24} color={COLORS.white} />
				</TouchableOpacity>
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
