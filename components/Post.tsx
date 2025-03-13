import { useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"

import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"

import { Link } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Image } from "expo-image"

import { styles } from "@/styles/feed.styles"
import { COLORS } from "@/constants/theme"
import CommentsModal from "./CommentsModal"
import { formatDistanceToNow } from "date-fns"
import { useUser } from "@clerk/clerk-expo"

type PostProps = {
	post: {
		_id: Id<"posts">
		imageUrl: string
		caption?: string
		likes: number
		comments: number
		isLiked: boolean
		isBookmarked: boolean
		_creationTime: number
		author: {
			_id: string
			username: string
			image: string
		}
	}
}
export default function Post({ post }: PostProps) {
	const [isLiked, setIsLiked] = useState(false)
	const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)
	const [showComments, setShowComments] = useState(false)

	const toggleLike = useMutation(api.posts.toggleLike)
	const toggleBookmark = useMutation(api.bookmarks.toggleBookmark)
	const deletePost = useMutation(api.posts.deletePost)

	const { user } = useUser()

	const currentUser = useQuery(api.users.getUserByClerkId, user ? { clerkId: user?.id } : "skip")

	const hanldeLike = async () => {
		try {
			const newIsLiked = await toggleLike({ postId: post._id })
			setIsLiked(newIsLiked)
		} catch (error) {
			console.error("Error toggling like: ", error)
		}
	}

	const handleBookmark = async () => {
		const newIsBookmarked = await toggleBookmark({ postId: post._id })
		setIsBookmarked(newIsBookmarked)
	}

	const handleDeletePost = async () => {
		try {
			await deletePost({ postId: post._id })
		} catch (error) {
			console.error("Error deleting post: ", error)
		}
	}

	return (
		<View style={styles.post}>
			<View style={styles.postHeader}>
				<Link href={currentUser?._id === post.author._id ? "/(tabs)/profile" : `/user/${post.author._id}`} asChild>
					<TouchableOpacity style={styles.postHeaderLeft}>
						<Image source={post.author.image} style={styles.postAvatar} contentFit="cover" transition={200} cachePolicy={"memory-disk"} />
						<Text style={styles.postUsername}>{post.author.username}</Text>
					</TouchableOpacity>
				</Link>
				{/* if im the owner, show the delete button */}
				{post.author._id === currentUser?._id ? (
					<TouchableOpacity onPress={handleDeletePost}>
						<Ionicons name="trash-outline" size={20} color={COLORS.primary} />
					</TouchableOpacity>
				) : (
					<TouchableOpacity>
						<Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
					</TouchableOpacity>
				)}
			</View>

			{/* Post image */}

			<Image source={post.imageUrl} style={styles.postImage} contentFit="cover" transition={200} cachePolicy={"memory-disk"} />
			{/* post actions */}
			<View style={styles.postActions}>
				<View style={styles.postActionsLeft}>
					<TouchableOpacity onPress={hanldeLike}>
						<Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? COLORS.primary : "white"} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setShowComments(true)} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
						<Ionicons name="chatbubble-outline" size={22} color="white" />
						<Text style={styles.commentText}>{post.comments > 0 && post.comments}</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={handleBookmark}>
					<Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={22} color="white" />
				</TouchableOpacity>
			</View>
			{/* post info */}
			<View style={styles.postInfo}>
				<Text style={styles.likesText}>
					{post.likes > 0 ? `${post.likes.toLocaleString()} ${post.likes > 1 ? "likes" : "like"} ` : "Be the first to like"}
				</Text>
				{post.caption && (
					<View style={styles.captionContainer}>
						<Text style={styles.captionUsername}>{post.author.username}</Text>
						<Text style={styles.captionText}>{post.caption}</Text>
					</View>
				)}
				{post.comments > 0 && (
					<TouchableOpacity onPress={() => setShowComments(true)}>
						<Text style={styles.commentsText}>View all {post.comments} commnents</Text>
					</TouchableOpacity>
				)}

				<Text style={styles.timeAgo}>{formatDistanceToNow(post._creationTime, { addSuffix: true })}</Text>
			</View>
			<CommentsModal postId={post._id} visible={showComments} onClose={() => setShowComments(false)} />
		</View>
	)
}
