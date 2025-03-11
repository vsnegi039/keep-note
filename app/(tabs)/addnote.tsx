import { useEffect, useState } from "react";
import {
	AntDesign,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import { View, TouchableOpacity, TextInput, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTasksDispatch, useTasks } from "@/hooks/taskList";
import { useRouter, useLocalSearchParams } from "expo-router";
import AddReminder from "@/components/addreminder";
import { useSelected, useLabels } from "@/hooks/taskList";

export default function Addnote() {
	const { id } = useLocalSearchParams();
	const notes = useTasks("all", []);
	const navigation = useNavigation();
	const dispatch = useTasksDispatch();
	const router = useRouter();
	const selectedOption = useSelected();
	const [isReminder, setisReminder] = useState<boolean>(false);
	const labels = useLabels();

	const [noteData, setNoteData] = useState({
		id: "",
		title: "",
		note: "",
		pinned: false,
		archived: false,
		deleted: false,
		labels: [] as string[],
	});

	useEffect(() => {
		let data = labels
			.filter(data => data.label === selectedOption)
			.map(data => data.label);
		setNoteData(prev => ({ ...prev, labels: data }));
	}, []);

	useEffect(() => {
		if (id && typeof id === "string") {
			const note = notes.find(note => note.id === id);
			if (note) {
				setNoteData({
					id: note.id,
					title: note.title,
					note: note.note,
					pinned: note.pinned,
					archived: note.archived,
					deleted: note.deleted,
					labels: note.labels,
				});
			}
		} else {
			setNoteData(prev => ({
				...prev,
				id:
					Date.now().toString(36) +
					Math.random().toString(36).substring(2),
			}));
		}
	}, [id, notes]);

	useEffect(() => {
		if (noteData.deleted) {
			dispatch({
				type: "added",
				...noteData,
				reminders: [],
			});
			router.push("/");
		}
	}, [noteData.deleted]);

	const handleChange = (key: string, value: string | boolean) => {
		setNoteData(prev => ({
			...prev,
			[key]: value,
		}));
	};

	useEffect(() => {
		const unsubscribe = navigation.addListener("beforeRemove", () => {
			if (noteData.title || noteData.note) {
				dispatch({
					type: "added",
					...noteData,
					title: noteData.title.trim() || "Untitled",
					note: noteData.note.trim() || "No content",
					reminders: [],
				});
			}
		});

		return unsubscribe;
	}, [navigation, noteData]);

	return (
		<>
			{isReminder === true && (
				<AddReminder setisReminder={setisReminder} />
			)}
			<View className="mt-12 py-2 px-6 bg-white">
				<View className="flex-row">
					<View className="w-2/4">
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<AntDesign
								name="arrowleft"
								size={24}
								color="black"
							/>
						</TouchableOpacity>
					</View>
					<View className="w-2/4 flex-row justify-end gap-5">
						<TouchableOpacity
							onPress={() =>
								handleChange("pinned", !noteData.pinned)
							}
						>
							{noteData.pinned ? (
								<AntDesign
									name="pushpin"
									size={24}
									color="black"
								/>
							) : (
								<AntDesign
									name="pushpino"
									size={24}
									color="black"
								/>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() =>
								handleChange("archived", !noteData.archived)
							}
						>
							{noteData.archived ? (
								<MaterialCommunityIcons
									name="archive-arrow-up"
									size={24}
									color="black"
								/>
							) : (
								<MaterialCommunityIcons
									name="archive-arrow-down"
									size={24}
									color="black"
								/>
							)}
						</TouchableOpacity>
						<Pressable
							onPress={() => {
								setisReminder(true);
							}}
						>
							<MaterialCommunityIcons
								name="bell-plus"
								size={24}
								color="black"
							/>
						</Pressable>
						<Pressable
							onPress={() => {
								router.push(
									`/editlabel?adding=false&editing=false&noteId=${noteData.id}`
								);
							}}
						>
							<MaterialIcons
								name="label-outline"
								size={24}
								color="black"
							/>
						</Pressable>
						<TouchableOpacity
							onPress={() => {
								handleChange("deleted", true);
							}}
						>
							<AntDesign name="delete" size={24} color="black" />
						</TouchableOpacity>
					</View>
				</View>

				<View className="mt-8">
					<TextInput
						value={noteData.title}
						className="text-3xl"
						onChangeText={text => handleChange("title", text)}
						placeholder="Title"
					/>
					<TextInput
						value={noteData.note}
						className="text-xl"
						onChangeText={text => handleChange("note", text)}
						placeholder="Note"
						multiline
					/>
				</View>
			</View>
		</>
	);
}
