import { COLORS } from "@/constants/theme"
import { StyleSheet } from "react-native"

/**
 * Styles for the ConfirmModal component
 * @returns {Object} - The styles object
 */

export const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: { backgroundColor: COLORS.background, padding: 20, borderRadius: 20, borderColor: COLORS.primary, borderWidth: 2 },
	modalHeader: { fontSize: 16, fontWeight: "bold", color: COLORS.white },
	modalButtons: { flexDirection: "row", justifyContent: "center", alignContent: "center", gap: 20, alignItems: "center" },
	confirmButton: {
		backgroundColor: COLORS.background,
		borderColor: "red",
		borderWidth: 2,
		borderRadius: 10,
		padding: 5,
		width: 100,
		alignItems: "center",
		marginBottom: 5,
	},
	confirmButtonText: { color: "red", fontWeight: "bold", fontSize: 16 },

	cancelButton: {
		backgroundColor: COLORS.background,
		borderColor: COLORS.primary,
		borderWidth: 2,
		borderRadius: 10,
		padding: 5,
		width: 100,
		alignItems: "center",
		marginBottom: 5,
	},
	cancelButtonText: { color: COLORS.primary, fontWeight: "bold", fontSize: 16 },
})
