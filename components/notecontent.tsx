import {
	View,
	TextInput,
	FlatList,
	TouchableOpacity,
	Text,
	Pressable,
} from "react-native";
import {
	AntDesign,
	FontAwesome5,
	Ionicons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useState } from "react";

interface NoteContentProps {
	noteData: {
		title: string;
		note: string;
		tasks: { text: string; completed: boolean }[];
		descriptionType: boolean;
	};
	handleChange?: (key: string, value: any) => void;
	toggleTaskCompletion?: (index: number) => void;
	handleTaskChange?: (index: number, text: string) => void;
	addTask?: () => void;
	deleteTask?: (index: number) => void;
	checkboxState?: boolean;
	setCheckboxState?: React.Dispatch<React.SetStateAction<boolean>>;
	source: string;
}

export default function NoteContent({
	noteData,
	handleChange,
	toggleTaskCompletion,
	handleTaskChange,
	addTask,
	deleteTask,
	checkboxState,
	setCheckboxState,
	source,
}: NoteContentProps) {
	const [focusedIndex, setFocusedIndex] = useState<null | number>(null);
	return (
		<View>
			{/* Title */}
			<View className="flex-row items-center justify-between">
				<TextInput
					value={noteData.title}
					className="text-3xl w-[95%]"
					onChangeText={text => {
						if (typeof handleChange === "function")
							handleChange("title", text);
					}}
					placeholder="Title"
				/>
				{!noteData.descriptionType && source === "addnote" && (
					<View className="relative">
						<Pressable
							onPress={() => {
								if (typeof setCheckboxState === "function")
									setCheckboxState(true);
							}}
						>
							<FontAwesome5
								name="ellipsis-v"
								size={17}
								color="gray"
							/>
						</Pressable>
						<Pressable
							className={`bg-gray-300 p-5 -right-6 w-[150px] absolute ${
								!checkboxState ? "hidden" : ""
							}`}
							onPress={() => {
								if (typeof handleChange === "function")
									handleChange("descriptionType", true);
								if (typeof setCheckboxState === "function")
									setCheckboxState(false);
							}}
						>
							<Text>Hide checkboxes</Text>
						</Pressable>
					</View>
				)}
			</View>

			{/* Note */}
			{noteData.descriptionType ? (
				<TextInput
					value={noteData.note}
					className="text-xl"
					onChangeText={text => {
						if (typeof handleChange === "function")
							handleChange("note", text);
					}}
					placeholder="Note"
					multiline
				/>
			) : (
				<>
					<FlatList
						data={noteData.tasks}
						keyExtractor={(_, index) => index.toString()}
						renderItem={({ item, index }) => (
							<View className="flex-row items-center">
								<TouchableOpacity
									onPress={() => {
										if (
											typeof toggleTaskCompletion ===
											"function"
										)
											toggleTaskCompletion(index);
									}}
								>
									{item.completed ? (
										<Ionicons
											name="checkbox"
											size={24}
											color="black"
										/>
									) : (
										<MaterialCommunityIcons
											name="checkbox-blank-outline"
											size={24}
											color="black"
										/>
									)}
								</TouchableOpacity>
								<TextInput
									value={item.text}
									className="text-xl ml-3 flex-1"
									onChangeText={text => {
										if (
											typeof handleTaskChange ===
											"function"
										)
											handleTaskChange(index, text);
									}}
									placeholder="New task"
									onFocus={() => setFocusedIndex(index)}
									onBlur={() => setFocusedIndex(null)}
								/>
								{focusedIndex === index && (
									<TouchableOpacity
										onPress={() => {
											if (
												typeof deleteTask === "function"
											)
												deleteTask(index);
										}}
									>
										<AntDesign
											name="close"
											size={24}
											color="black"
										/>
									</TouchableOpacity>
								)}
							</View>
						)}
					/>
					{/* Add New Task Button */}
					{source === "addnote" && (
						<Pressable
							className="flex-row items-center mt-3"
							onPress={addTask}
						>
							<Ionicons
								name="add-circle"
								size={24}
								color="black"
							/>
							<Text className="ml-2 text-lg">Add Task</Text>
						</Pressable>
					)}
				</>
			)}
		</View>
	);
}
