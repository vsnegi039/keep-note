import {
	View,
	Text,
	Image,
	ScrollView,
	TextInput,
	StyleSheet,
	Platform,
	Button,
	Alert,
	TouchableOpacity,
	Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import tw from "tailwind-react-native-classnames";
import {
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import Sidebar from "@/components/sidebar";
import { useRouter, usePathname } from "expo-router";
import { useTasks, useSelected, useLabels } from "@/hooks/taskList";

function TextNote({
	title,
	description,
	gridView,
	id,
}: {
	title: string;
	description: string;
	gridView: boolean;
	id: string;
}) {
	const router = useRouter();
	return (
		<Pressable
			className={`p-5 border rounded-md ${gridView ? "w-[45%]" : ""}`}
			onPress={() => router.push(`/addnote?id=${id}`)}
		>
			<Text className={`text-xl font-bold`}>{title}</Text>
			<Text>{description}</Text>
		</Pressable>
	);
}

export default function HomeScreen() {
	let data: null | string[] = [];
	const router = useRouter();
	const pathname = usePathname();
	const [gridView, setGridView] = useState<boolean>(true);
	const [sidebarState, setsidebarState] = useState<boolean>(false);
	const selectedOption = useSelected();
	const labels = useLabels();
	const tasks = useTasks(selectedOption, labels);
	const openSidebar = () => {
		setsidebarState(true);
	};
	const closeSidebar = () => {
		setsidebarState(false);
	};

	if (!data)
		return (
			<>
				<Sidebar
					sidebarState={sidebarState}
					closeSidebar={closeSidebar}
				/>
				<View
					className={`h-full w-full flex justify-center items-center bg-white`}
				>
					<Text className={`text-gray-500 text-lg`}>
						Notes you add appear here
					</Text>
				</View>
			</>
		);
	else {
		return (
			<>
				<Sidebar
					sidebarState={sidebarState}
					closeSidebar={closeSidebar}
				/>
				<View className="h-full w-full bg-white">
					<View className="mt-12">
						<View className="bg-gray-200 mx-5 my-4 flex-row items-center rounded-full py-2 px-4">
							<TouchableOpacity
								className="cursor-pointer"
								onPress={openSidebar}
							>
								<Ionicons name="menu" size={30} color="black" />
							</TouchableOpacity>
							<TextInput
								className="ml-3 w-[70%] text-black"
								placeholder="Search your notes"
							/>
							{gridView ? (
								<MaterialCommunityIcons
									name="view-agenda-outline"
									size={24}
									color="black"
									onPress={() => setGridView(false)}
								/>
							) : (
								<MaterialIcons
									name="grid-view"
									size={24}
									color="black"
									onPress={() => setGridView(true)}
								/>
							)}
						</View>
					</View>
					<View
						className={`py-2 px-8 gap-5 w-full ${
							gridView ? "flex-row flex-wrap justify-between" : ""
						}`}
					>
						{tasks.map(task => (
							<TextNote
								key={task.id}
								id={task.id}
								title={task.title}
								description={task.note}
								gridView={gridView}
							/>
						))}
					</View>
					<TouchableOpacity
						className="flex-row items-center bg-blue-500 p-3 rounded-lg absolute bottom-[30px] right-[15px]"
						onPress={() => router.push("/addnote")}
					>
						<Ionicons name="add" size={30} color="white" />
					</TouchableOpacity>
				</View>
			</>
		);
	}
}

const styles = StyleSheet.create({
	input: {},
});
