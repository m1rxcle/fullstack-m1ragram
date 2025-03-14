import { View, Text, TouchableOpacity, ScrollView, Pressable, FlatList, Modal } from "react-native"
import { useState } from "react"

import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Image } from "expo-image"

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"

import Loader from "@/components/Loader"
import { COLORS } from "@/constants/theme"

import { styles } from "@/styles/profile.styles"
export default function UserProfileScreen() {
	const { id } = useLocalSearchParams()

	const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null)
	const router = useRouter()

	const profile = useQuery(api.users.getUserProfile, { id: id as Id<"users"> })
	const posts = useQuery(api.posts.getPostByUser, { userId: id as Id<"users"> })
	const isFollowing = useQuery(api.users.isFollowing, { followingId: id as Id<"users"> })

	const toggleFollow = useMutation(api.users.toggleFollow)

	const handleBack = () => {
		if (router.canGoBack()) router.back()
		else router.replace("/(tabs)")
	}

	if (profile === undefined || posts === undefined || isFollowing === undefined) return <Loader />

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBack}>
					<Ionicons name="arrow-back" size={24} color={COLORS.white} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>{profile.username}</Text>
				<View style={{ width: 24 }} />
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.profileInfo}>
					<View style={styles.avatarAndStats}>
						{/* Avatar */}
						<Image source={profile.image} style={styles.avatar} contentFit="cover" cachePolicy="memory-disk" />

						{/* Stats */}
						<View style={styles.statsContainer}>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{profile.posts}</Text>
								<Text style={styles.statLabel}>Публикации</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{profile.followers}</Text>
								<Text style={styles.statLabel}>Подписчики</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{profile.following}</Text>
								<Text style={styles.statLabel}>Подписки</Text>
							</View>
						</View>
					</View>

					<Text style={styles.name}>{profile.fullname}</Text>
					{profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

					<Pressable
						style={[styles.followButton, isFollowing && styles.followingButton]}
						onPress={() => toggleFollow({ followingId: id as Id<"users"> })}
					>
						<Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>{isFollowing ? "Отписаться" : "Подписаться"}</Text>
					</Pressable>
				</View>

				<View style={styles.postsGrid}>
					{posts.length === 0 ? (
						<View style={styles.noPostsContainer}>
							<Ionicons name="image-outline" size={80} color={COLORS.grey} />
							<Text style={styles.noPostsText}>Еще нет постов!</Text>
						</View>
					) : (
						<FlatList
							data={posts}
							numColumns={3}
							scrollEnabled={false}
							renderItem={({ item }) => (
								<TouchableOpacity style={styles.gridItem} onPress={() => setSelectedPost(item)}>
									<Image source={item.imageUrl} style={styles.gridImage} contentFit="cover" transition={200} cachePolicy="memory-disk" />
								</TouchableOpacity>
							)}
							keyExtractor={(item) => item._id}
						/>
					)}
				</View>
			</ScrollView>
			<Modal visible={!!selectedPost} animationType="fade" transparent={true} onRequestClose={() => setSelectedPost(null)}>
				<View style={styles.modalBackdrop}>
					{selectedPost && (
						<View style={styles.postDetailContainer}>
							<View style={styles.postDetailHeader}>
								<TouchableOpacity onPress={() => setSelectedPost(null)}>
									<Ionicons name="close" size={24} color={COLORS.white} />
								</TouchableOpacity>
							</View>
							<Image source={selectedPost.imageUrl} cachePolicy={"memory-disk"} style={styles.postDetailImage} />
						</View>
					)}
				</View>
			</Modal>
		</View>
	)
}
