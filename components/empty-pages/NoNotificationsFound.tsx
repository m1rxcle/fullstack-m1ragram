import { COLORS } from "@/constants/theme"
import { styles } from "@/styles/notifications.styles"
import { Ionicons } from "@expo/vector-icons"
import { View, Text } from "react-native"
export default function NoNotificationsFound() {
	return (
		<View style={[styles.container, styles.centered]}>
			<Ionicons name="notifications-outline" size={48} style={{ marginBottom: 20 }} color={COLORS.primary} />
			<Text
				style={{
					color: COLORS.white,
					fontSize: 22,
				}}
			>
				Нет никаких уведомлений!
			</Text>
		</View>
	)
}
