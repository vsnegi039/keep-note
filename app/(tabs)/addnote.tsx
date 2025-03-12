import { useEffect, useState } from "react";
import {
	AntDesign,
	FontAwesome5,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import {
	View,
	TouchableOpacity,
	TextInput,
	Pressable,
	FlatList,
	TouchableWithoutFeedback,
	Text,
	Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTasksDispatch, useTasks } from "@/hooks/taskList";
import { useRouter, useLocalSearchParams } from "expo-router";
import AddReminder from "@/components/addreminder";
import { useSelected, useLabels } from "@/hooks/taskList";
import NoteFooter from "@/components/note-footer";
import { KeyboardAvoidingView, Platform } from "react-native";
import NoteContent from "@/components/notecontent";

export default function Addnote() {
	const { id } = useLocalSearchParams();
	const notes = useTasks("all", []);
	const navigation = useNavigation();
	const dispatch = useTasksDispatch();
	const router = useRouter();
	const selectedOption = useSelected();
	const [isReminder, setisReminder] = useState<boolean>(false);
	const [focusedIndex, setFocusedIndex] = useState<null | number>(null);
	const labels = useLabels();

	const [noteData, setNoteData] = useState({
		id: "",
		title: "",
		note: "",
		pinned: false,
		archived: false,
		deleted: false,
		labels: [] as string[],
		tasks: [] as { text: string; completed: boolean }[],
		descriptionType: true,
		updatedAt: null as Date | null,
	});

	const [checkboxState, setCheckboxState] = useState<boolean>(false);

	const handleChange = (key: string, value: any) => {
		setNoteData(prev => ({
			...prev,
			[key]: value,
		}));
	};

	// Add New Task
	const addTask = () => {
		setNoteData(prev => ({
			...prev,
			tasks: [...prev.tasks, { text: "", completed: false }],
		}));
	};

	// Handle Task Text Change
	const handleTaskChange = (index: number, text: string) => {
		const updatedTasks = [...noteData.tasks];
		updatedTasks[index].text = text;
		setNoteData(prev => ({
			...prev,
			tasks: updatedTasks,
		}));
	};

	// Toggle Task Completion
	const toggleTaskCompletion = (index: number) => {
		const updatedTasks = [...noteData.tasks];
		updatedTasks[index].completed = !updatedTasks[index].completed;
		setNoteData(prev => ({
			...prev,
			tasks: updatedTasks,
		}));
	};

	// Delete Task
	const deleteTask = (index: number) => {
		const updatedTasks = noteData.tasks.filter((_, i) => i !== index);
		setNoteData(prev => ({
			...prev,
			tasks: updatedTasks,
		}));
	};

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
					tasks: note.tasks || [],
					descriptionType: note.descriptionType,
					updatedAt: note.updatedAt
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
				tasks: [],
				updatedAt: new Date(),
			});
			router.push("/");
		}
	}, [noteData.deleted]);

	useEffect(() => {
		if (noteData.descriptionType && noteData.tasks.length) {
			const data = noteData.tasks.map(value => value.text);
			const val = data.join("\n");
			setNoteData(prev => ({ ...prev, note: val, tasks: [] }));
		} else if (noteData.note.length > 0 && noteData.note.length < 1) {
			const value =
				noteData.note.split("\n").length > 0
					? noteData.note.split("\n")
					: [""];
			const data = value.map(value => {
				return { text: value, completed: false };
			});
			setNoteData(prev => ({ ...prev, note: "", tasks: data }));
		}
	}, [noteData.descriptionType]);

	const saveNote = () => {
		if (noteData.title || noteData.note || noteData.tasks.length > 0) {
			dispatch({
				type: "added",
				...noteData,
				title: noteData.title.trim() || "Untitled",
				note: noteData.note.trim() || "No content",
				reminders: [],
				updatedAt: new Date(),
			});
		}
	};

	useEffect(() => {
		const unsubscribe = navigation.addListener("beforeRemove", () => {
			saveNote();
		});

		return unsubscribe;
	}, [navigation, noteData]);

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss();
				if (checkboxState) setCheckboxState(false);
			}}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<>
					{isReminder === true && (
						<AddReminder setisReminder={setisReminder} />
					)}
					<View className="mt-12 py-2 px-6 bg-white">
						{/* Header */}
						<View className="flex-row">
							<View className="w-2/4">
								<TouchableOpacity
									onPress={() => navigation.goBack()}
								>
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
									<AntDesign
										name={
											noteData.pinned
												? "pushpin"
												: "pushpino"
										}
										size={24}
										color="black"
									/>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() =>
										handleChange(
											"archived",
											!noteData.archived
										)
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
							</View>
						</View>
						<NoteContent
							noteData={noteData}
							handleChange={handleChange}
							toggleTaskCompletion={toggleTaskCompletion}
							handleTaskChange={handleTaskChange}
							addTask={addTask}
							deleteTask={deleteTask}
							checkboxState={checkboxState}
							setCheckboxState={setCheckboxState}
							source="addnote"
						/>
					</View>
					<NoteFooter
						handleChange={handleChange}
						id={noteData.id}
						saveNote={saveNote}
						noteData={{ ...noteData, reminders: [] }}
					/>
				</>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}
