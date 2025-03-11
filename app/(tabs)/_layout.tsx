import { Stack } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function StackLayout() {
	const colorScheme = useColorScheme();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].background,
				},
				animation: "slide_from_right",
			}}
		>
			<Stack.Screen name="index" options={{ title: "Home" }} />
			<Stack.Screen name="explore" options={{ title: "Explore" }} />
			<Stack.Screen name="addnote" options={{ title: "Add Note" }} />
			<Stack.Screen name="editlabel" options={{ title: "Edit label" }} />
		</Stack>
	);
}
