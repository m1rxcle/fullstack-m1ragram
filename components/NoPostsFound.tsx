import { View, Text } from "react-native"

import { COLORS } from "@/constants/theme"

export default function NoPostsFound() {
	return (
		<View style={{ height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
			<Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
		</View>
	)
}
