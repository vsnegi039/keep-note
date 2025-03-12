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
import NoteContent from "@/components/notecontent";
interface NewTaskType {
	text: string;
	completed: boolean;
}
interface TaskType {
	id: string;
	title: string;
	note: string;
	archived: boolean;
	pinned: boolean;
	deleted: boolean;
	labels: string[];
	tasks: NewTaskType[];
	reminders: [];
	descriptionType: boolean;
}

function TextNote({
	noteData,
	gridView,
	id,
}: {
	noteData: TaskType;
	gridView: boolean;
	id: string;
}) {
	const router = useRouter();
	return (
		<Pressable
			className={`p-5 border relative rounded-md ${
				gridView ? "w-[45%]" : ""
			}`}
			onPress={() => router.push(`/addnote?id=${id}`)}
		>
			<NoteContent noteData={noteData} source="index" />
			<Pressable
				className="absolute w-full h-full m-5 left-0 top-0 z-333333333"
				onPress={() => router.push(`/addnote?id=${id}`)}
			></Pressable>
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
	const pinned = tasks.filter(task => task.pinned);
	const others = tasks.filter(task => !task.pinned);
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
					<View className="pb-2 px-8">
						{pinned.length > 0 && others.length > 0 && (
							<Text className="py-2">Pinned</Text>
						)}
						<View
							className={`gap-5 w-full ${
								gridView
									? "flex-row flex-wrap justify-between"
									: ""
							}`}
						>
							{pinned.map(task => (
								<TextNote
									key={task.id}
									noteData={task}
									gridView={gridView}
									id={task.id}
								/>
							))}
						</View>
						{pinned.length > 0 && others.length > 0 && (
							<Text className="pt-6 pb-2">Others</Text>
						)}
						<View
							className={`gap-5 w-full ${
								gridView
									? "flex-row flex-wrap justify-between"
									: ""
							}`}
						>
							{others.map(task => (
								<TextNote
									key={task.id}
									noteData={task}
									gridView={gridView}
									id={task.id}
								/>
							))}
						</View>
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
