import {
	AntDesign,
	Entypo,
	EvilIcons,
	Feather,
	FontAwesome,
	FontAwesome5,
	FontAwesome6,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTasksDispatch, useLabels } from "@/hooks/taskList";

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
	updatedAt: Date|null;
}

function AddReminder({
	menu,
	setVisibleMenu,
}: {
	menu: {
		text: string;
		icon: React.JSX.Element;
		handler: () => void;
	}[];
	setVisibleMenu: React.Dispatch<React.SetStateAction<string>>;
}) {
	return (
		<Pressable
			className="absolute h-full w-full bottom-0 left-0 bg-gray-400 flex-row items-end"
			onPress={() => setVisibleMenu("")}
		>
			<Pressable className="w-full bg-white rounded-s-3xl p-2">
				{menu.map((data, i) => {
					return (
						<Pressable
							className="flex-row p-3 justify-between items-center"
							key={i}
							onPress={data.handler}
						>
							<View className="w-1/2 flex-row gap-3 items-center">
								{data.icon}
								<Text>{data.text}</Text>
							</View>
						</Pressable>
					);
				})}
			</Pressable>
		</Pressable>
	);
}

export default function NoteFooter({
	handleChange,
	id,
	saveNote,
	noteData,
}: {
	handleChange: (key: string, value: any) => void;
	id: string;
	saveNote: () => void;
	noteData: TaskType;
	}) {
	const dispatchNote = useTasksDispatch();
	const labels = useLabels();
	const router = useRouter();
	const [visibleMenu, setVisibleMenu] = useState<string>("");
	const copyHandler = () => {
		const id =
			Date.now().toString(36) + Math.random().toString(36).substring(2);
		dispatchNote({ type: "added", ...noteData, id, updatedAt: new Date() });
		router.push("/");
	};
	const shareHandler = () => {
		console.log("share handler");
	};
	const collaboraterHandler = () => {
		console.log("collaborater handler");
	};
	const labelHandler = () => {
		if (labels.length) {
			saveNote();
			router.push(`/editlabel?adding=false&editing=false&noteId=${id}`);
		}
	};
	const helpAndFeedbackHandler = () => {
		console.log("helperAndFeedback handler");
	};
	const takePhotoHandler = () => {
		console.log("take photo handler");
	};
	const addImageHandler = () => {
		console.log("add image handler");
	};
	const drawingHandler = () => {
		console.log("drawing handler");
	};
	const recordingHandler = () => {
		console.log("recording handler");
	};
	const tickBoxHandler = () => {
		handleChange("descriptionType", false);
		setVisibleMenu("");
	};

	const getTime = (date: Date) => {
		const now = new Date(date);
		const diffInMinutes = (now.getTime() - date.getTime()) / 60000;

		if (diffInMinutes < 2) {
			return "Just now";
		}

		const time = date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});

		return "at " + time;
	};
	const utilMenu = [
		{
			text: "Delete",
			icon: <AntDesign name="delete" size={24} color="black" />,
			handler: () => handleChange("deleted", true),
		},
		{
			text: "Make a copy",
			icon: <FontAwesome6 name="copy" size={24} color="black" />,
			handler: copyHandler,
		},
		// {
		// 	text: "Send",
		// 	icon: <EvilIcons name="share-google" size={24} color="black" />,
		// 	handler: shareHandler,
		// },
		// {
		// 	text: "Collaborator",
		// 	icon: <Feather name="user-plus" size={24} color="black" />,
		// 	handler: collaboraterHandler,
		// },
		{
			text: "Labels",
			icon: (
				<MaterialIcons
					name="label-outline"
					size={24}
					color={labels.length > 0 ? "black" : "gray"}
				/>
			),
			handler: labelHandler,
		},
		// {
		// 	text: "Help & feedback",
		// 	icon: <AntDesign name="questioncircleo" size={24} color="black" />,
		// 	handler: helpAndFeedbackHandler,
		// },
	];
	const insertMenu = [
		{
			text: "Take photo",
			icon: <AntDesign name="camerao" size={24} color="black" />,
			handler: takePhotoHandler,
		},
		{
			text: "Add image",
			icon: <Entypo name="image" size={24} color="black" />,
			handler: addImageHandler,
		},
		// {
		// 	text: "Drawing",
		// 	icon: <FontAwesome name="paint-brush" size={24} color="black" />,
		// 	handler: drawingHandler,
		// },
		// {
		// 	text: "Recording",
		// 	icon: (
		// 		<MaterialCommunityIcons
		// 			name="microphone-outline"
		// 			size={24}
		// 			color="black"
		// 		/>
		// 	),
		// 	handler: recordingHandler,
		// },
		{
			text: "Tick boxes",
			icon: <Ionicons name="checkbox-outline" size={24} color="black" />,
			handler: tickBoxHandler,
		},
	];
	return (
		<>
			<View className="absolute bottom-0 left-0 w-full flex-row p-4 items-center justify-between">
				<View className="flex-row items-center gap-5">
					<Pressable onPress={() => setVisibleMenu("insertMenu")}>
						<AntDesign name="plussquareo" size={24} color="black" />
					</Pressable>
					<Pressable>
						<Ionicons
							name="color-palette-outline"
							size={24}
							color="black"
						/>
					</Pressable>
					<Pressable>
						<MaterialIcons
							name="format-underlined"
							size={24}
							color="gray"
						/>
					</Pressable>
					<Text>
						Edited{" "}
						{noteData.updatedAt
							? getTime(noteData.updatedAt)
							: "just now"}
					</Text>
				</View>
				<Pressable onPress={() => setVisibleMenu("utilMenu")}>
					<FontAwesome5 name="ellipsis-v" size={17} color="black" />
				</Pressable>
			</View>
			{visibleMenu === "utilMenu" && (
				<AddReminder menu={utilMenu} setVisibleMenu={setVisibleMenu} />
			)}
			{visibleMenu === "insertMenu" && (
				<AddReminder
					menu={insertMenu}
					setVisibleMenu={setVisibleMenu}
				/>
			)}
		</>
	);
}
