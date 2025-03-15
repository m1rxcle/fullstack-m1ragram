import { styles } from "@/styles/confirm-modal.styles"
import { View, Text, Modal, TouchableOpacity } from "react-native"

type ConfirmModalProps = {
	title: string
	isVisible: boolean
	onConfirm: () => void
	setCloseModal: () => void
}
export default function ConfirmModal({ title, isVisible, onConfirm, setCloseModal }: ConfirmModalProps) {
	return (
		<Modal visible={isVisible} animationType="fade" transparent={true} onRequestClose={() => setCloseModal()}>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<View style={{ marginBottom: 40 }}>
						<Text style={styles.modalHeader}>{title}</Text>
					</View>
					<View style={styles.modalButtons}>
						<TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
							<Text style={styles.confirmButtonText}>Да</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.cancelButton} onPress={() => setCloseModal()}>
							<Text style={styles.cancelButtonText}>Нет</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}
