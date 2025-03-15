import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	FlatList,
	Modal,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TextInput,
} from "react-native"
import { useState } from "react"

import * as ImagePicker from "expo-image-picker"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@clerk/clerk-expo"

import { Doc } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"

import ConfirmModal from "@/components/ConfirmModal"
import Loader from "@/components/Loader"
import NoPostsFound from "@/components/empty-pages/NoPostsFound"
import { COLORS } from "@/constants/theme"

import { styles } from "@/styles/profile.styles"

export default function Profile() {
	const { signOut, userId } = useAuth()
	const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip")

	const [isEditModalVisible, setIsEditModalVisible] = useState(false)

	const [editedProfile, setEditedProfile] = useState({
		image: currentUser?.image || "",
		fullname: currentUser?.fullname || "",
		bio: currentUser?.bio || "",
	})

	const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null)
	const [confirmSignOutModalVisible, setConfirmSignOutModalVisible] = useState(false)
	const [selectedImage, setSelectedImage] = useState<string | null>(null)

	const posts = useQuery(api.posts.getPostByUser, {})

	const updateProfile = useMutation(api.users.updateProfile)

	const handleSaveProfile = async () => {
		try {
			await updateProfile(editedProfile)
			setIsEditModalVisible(false)
		} catch (error) {
			console.log("Error updating profile: ", error)
		}
	}

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		})
		if (!result.canceled) {
			setSelectedImage(result.assets[0].uri)
			setEditedProfile({ ...editedProfile, image: result.assets[0].uri })
		}
	}

	if (!currentUser || posts === undefined) return <Loader />

	return (
		<View style={styles.container}>
			{/* Header section */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Text style={styles.username}>{currentUser.username}</Text>
				</View>
				<View style={styles.headerRight}>
					<TouchableOpacity style={styles.headerIcon} onPress={() => setConfirmSignOutModalVisible(true)}>
						<Ionicons name="log-out-outline" size={24} color={COLORS.white} />
					</TouchableOpacity>
				</View>
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.profileInfo}>
					{/* Avatar and stats */}
					<View style={styles.avatarAndStats}>
						<View style={styles.avatarContainer}>
							<Image source={currentUser.image} style={styles.avatar} contentFit="cover" transition={200} />
						</View>

						<View style={styles.statsContainer}>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{currentUser.posts}</Text>
								<Text style={styles.statLabel}>Публикации</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{currentUser.followers}</Text>
								<Text style={styles.statLabel}>Подписчики</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statNumber}>{currentUser.following}</Text>
								<Text style={styles.statLabel}>Подписки</Text>
							</View>
						</View>
					</View>
					<Text style={styles.name}>{currentUser.fullname}</Text>
					{currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}

					<View style={styles.actionButtons}>
						<TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
							<Text style={styles.editButtonText}>Изменить профиль</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.shareButton}>
							<Ionicons name="share-outline" size={20} color={COLORS.white} />
						</TouchableOpacity>
					</View>
				</View>

				{posts.length === 0 && <NoPostsFound />}

				<FlatList
					data={posts}
					numColumns={3}
					scrollEnabled={false}
					renderItem={({ item }) => (
						<TouchableOpacity style={styles.gridItem} onPress={() => setSelectedPost(item)}>
							<Image source={item.imageUrl} style={styles.gridImage} contentFit="cover" transition={200} />
						</TouchableOpacity>
					)}
				/>
			</ScrollView>

			{/* Edit Profile Modal */}
			<Modal visible={isEditModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsEditModalVisible(false)}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Изменить профиль</Text>
								<TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
									<Ionicons name="close" size={24} color={COLORS.white} />
								</TouchableOpacity>
							</View>
							<View style={{ alignItems: "center" }}>
								{!selectedImage ? (
									<Image source={currentUser.image} style={styles.avatar} contentFit="cover" transition={200} />
								) : (
									<Image source={{ uri: selectedImage }} style={styles.avatar} contentFit="cover" transition={200} />
								)}
								<TouchableOpacity
									style={{
										marginTop: 10,
										flexDirection: "row",
										alignItems: "center",
										gap: 10,
										borderColor: COLORS.primary,
										borderWidth: 2,
										padding: 5,
										borderRadius: 10,
									}}
									onPress={pickImage}
								>
									<Ionicons name="image-outline" size={20} color={COLORS.white} />
									<Text style={{ color: COLORS.white }}>Изменить</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Имя</Text>
								<TextInput
									style={styles.input}
									value={editedProfile.fullname}
									onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, fullname: text }))}
									placeholderTextColor={COLORS.grey}
								/>
							</View>
							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Описание</Text>
								<TextInput
									style={[styles.input, styles.bioInput]}
									value={editedProfile.bio}
									onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, bio: text }))}
									multiline
									numberOfLines={4}
									placeholderTextColor={COLORS.grey}
								/>
							</View>
							<TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
								<Text style={styles.saveButtonText}>Сохранить</Text>
							</TouchableOpacity>
						</View>
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
			</Modal>
			{/* Selected Image Modal */}
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
			<ConfirmModal
				isVisible={confirmSignOutModalVisible}
				setCloseModal={() => setConfirmSignOutModalVisible(false)}
				title="Вы уверены, что хотите выйти?"
				onConfirm={() => {
					setConfirmSignOutModalVisible(false)
					signOut()
				}}
			/>
		</View>
	)
}
