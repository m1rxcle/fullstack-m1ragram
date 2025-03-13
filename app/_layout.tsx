import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { useCallback, useEffect } from "react"

import { useFonts } from "expo-font"
import { SplashScreen } from "expo-router"
import * as NavigationBar from "expo-navigation-bar"
import { StatusBar } from "expo-status-bar"

import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider"

import InitialLayout from "@/components/InitialLayout"
import { Platform } from "react-native"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		"JebBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
	})

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) SplashScreen.hideAsync()
	}, [fontsLoaded])

	// update for android navigation bar
	useEffect(() => {
		if (Platform.OS === "android") {
			NavigationBar.setBackgroundColorAsync("#000000")
			NavigationBar.setButtonStyleAsync("light")
		}
	}, [])

	return (
		<ClerkAndConvexProvider>
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1, backgroundColor: "black" }} onLayout={onLayoutRootView}>
					<InitialLayout />
				</SafeAreaView>
			</SafeAreaProvider>
			<StatusBar style="light" />
		</ClerkAndConvexProvider>
	)
}
