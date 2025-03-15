import { COLORS } from "@/constants/theme"
import { View, Text } from "react-native"
export default function NoStoryAvailable() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ fontSize: 20, color: COLORS.primary }}>No Stories Available</Text>
		</View>
	)
}
