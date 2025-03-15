import { COLORS } from "@/constants/theme"
import { View, Text } from "react-native"
export default function NoBookmarksFound() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: COLORS.background,
			}}
		>
			<Text
				style={{
					color: COLORS.primary,
					fontSize: 22,
				}}
			>
				Нет новых заметок
			</Text>
		</View>
	)
}
