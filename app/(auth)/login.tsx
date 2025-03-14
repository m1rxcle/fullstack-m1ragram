import { View, Text, Image, TouchableOpacity } from "react-native"

import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { useSSO } from "@clerk/clerk-expo"

import { COLORS } from "@/constants/theme"
import { styles } from "@/styles/auth.styles"

export default function Login() {
	const { startSSOFlow } = useSSO()
	const router = useRouter()
	const handleGoogleSignIn = async () => {
		console.log("Кнопка нажата") // Проверяем, вызывается ли функция

		try {
			const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google" })
			console.log("Session ID: ", createdSessionId)

			if (setActive && createdSessionId) {
				setActive({ session: createdSessionId })
				router.replace("/(tabs)")
			}
		} catch (error) {
			console.log("OAuth Error: ", error)
			alert("OAuth Error: " + error)
		}
	}
	return (
		<View style={styles.container}>
			{/* Brand Section*/}
			<View style={styles.brandSection}>
				<View style={styles.logoContainer}>
					<Ionicons name="leaf" size={32} color={COLORS.primary} />
				</View>
				<Text style={styles.appName}>miragram</Text>
				<Text style={styles.tagline}>Не упускай ничего.</Text>
			</View>
			{/* Illustration */}
			<View style={styles.illustrationContainer}>
				<Image style={styles.illustration} source={require("@/assets/images/auth-images/auth-bg-2.png")} resizeMode="cover" />
			</View>
			{/* Login Section */}
			<View style={styles.loginSection}>
				<TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} activeOpacity={0.9}>
					<View style={styles.googleIconContainer}>
						<Ionicons name="logo-google" size={20} color={COLORS.surface} />
					</View>
					<Text style={styles.googleButtonText}>Войти через Google</Text>
				</TouchableOpacity>
				<Text style={styles.termsText}>By continue, you agree to our Terms and Privacy Policy</Text>
			</View>
		</View>
	)
}
