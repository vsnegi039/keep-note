import { View, Text, TextInput, Pressable } from "react-native";
import {
	AntDesign,
	Entypo,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
	useLabelsDispatch,
	useLabels,
	useTasksDispatch,
	useTasks,
} from "@/hooks/taskList";
import { useRouter, useLocalSearchParams } from "expo-router";

interface NoteType {
	id: string;
	title: string;
	note: string;
	archived: boolean;
	pinned: boolean;
	deleted: boolean;
	labels: string[];
	reminders: [];
}

interface SearchParams {
	adding: string;
	editing: string;
	noteId: string;
}

export default function EditLabel() {
	const { adding, editing, noteId } =
		useLocalSearchParams() as unknown as SearchParams;
	const labels = useLabels();
	const navigation = useNavigation();
	if (editing === "true") {
		const dispatch = useLabelsDispatch();
		const [addLabel, setAddLabel] = useState<boolean>(adding === "true");
		const [newLabel, setNewLabel] = useState<string>("");
		const [isEditing, setIsEditing] = useState<string>("");
		const [editLabel, setEditLabel] = useState<string>("");

		const handleSaveLabel = () => {
			if (newLabel) {
				const uniqueId =
					Date.now().toString(36) +
					Math.random().toString(36).substring(2);
				dispatch({
					id: uniqueId,
					label: newLabel,
					type: "added",
				});
				setNewLabel("");
			}
			setAddLabel(false);
		};
		return (
			<View className="h-full w-full mt-8 bg-white">
				<View className="flex-row items-center gap-3 border-b py-4 px-6">
					<Pressable onPress={() => navigation.goBack()}>
						<AntDesign name="arrowleft" size={24} color="black" />
					</Pressable>
					<Text>Edit labels</Text>
				</View>
				{addLabel && (
					<View className="flex-row items-center justify-between border-b py-2 px-6">
						<View className="flex-row items-center gap-6">
							<Pressable onPress={() => setAddLabel(false)}>
								<AntDesign
									name="close"
									size={24}
									color="black"
								/>
							</Pressable>
							<TextInput
								placeholder="Create new label"
								value={newLabel}
								className="w-3/4"
								onChangeText={text => setNewLabel(text)}
							/>
						</View>
						<Pressable onPress={handleSaveLabel}>
							<AntDesign name="check" size={24} color="black" />
						</Pressable>
					</View>
				)}
				{!addLabel && (
					<Pressable
						className="flex-row items-center gap-6 border-b py-4 px-6"
						onPress={() => {
							if (isEditing) setIsEditing("");
							setAddLabel(true);
						}}
					>
						<AntDesign name="plus" size={24} color="black" />
						<Text>Create new label</Text>
					</Pressable>
				)}
				{labels.length > 0 &&
					labels.map(data => (
						<View
							key={data.id}
							className="flex-row items-center justify-between border-b py-4 px-6"
						>
							{isEditing === data.id && (
								<>
									<View className="flex-row items-center gap-6">
										<Pressable
											onPress={() =>
												dispatch({
													...data,
													type: "deleted",
												})
											}
										>
											<AntDesign
												name="delete"
												size={24}
												color="black"
											/>
										</Pressable>
										<TextInput
											value={editLabel}
											className="w-3/4"
											onChangeText={text =>
												setEditLabel(text)
											}
										/>
									</View>
									<Pressable
										onPress={() => {
											dispatch({
												type: "added",
												id: data.id,
												label: editLabel,
											});
											setIsEditing("");
										}}
									>
										<AntDesign
											name="check"
											size={24}
											color="black"
										/>
									</Pressable>
								</>
							)}
							{isEditing !== data.id && (
								<>
									<View className="flex-row items-center gap-6">
										<Pressable>
											<MaterialIcons
												name="label-outline"
												size={24}
												color="black"
											/>
										</Pressable>
										<Text>{data.label}</Text>
									</View>
									<Pressable
										onPress={() => {
											if (addLabel) setAddLabel(false);
											setEditLabel(data.label);
											setIsEditing(data.id);
										}}
									>
										<Entypo
											name="edit"
											size={24}
											color="black"
										/>
									</Pressable>
								</>
							)}
						</View>
					))}
			</View>
		);
	} else {
		const notes = useTasks("all", []);
		const noteData = notes.find(note => note.id === noteId);
		const router = useRouter();
		if (!noteData) {
			router.push('/addnote');
			return null;
		}
		const noteDispatch = useTasksDispatch();
		const [filteredLabels, setFilteredLabels] = useState<
			{ id: string; label: string }[]
		>([]);
		const [searchString, setSearchString] = useState<string>("");
		useEffect(() => {
			setFilteredLabels(
				labels.filter(data =>
					data.label
						.toLocaleLowerCase()
						.includes(searchString.toLocaleLowerCase())
				)
			);
		}, [searchString]);
		return (
			<View className="h-full w-full mt-8 bg-white">
				<View className="flex-row items-center gap-3 py-4 px-6">
					<Pressable onPress={() => navigation.goBack()}>
						<AntDesign name="arrowleft" size={24} color="black" />
					</Pressable>
					<TextInput
						placeholder="Enter label name"
						onChangeText={text => setSearchString(text)}
					/>
				</View>
				{filteredLabels.map(data => (
					<View
						key={data.id}
						className="flex-row items-center justify-between gap-6 px-6 py-2"
					>
						<View className="flex-row items-center gap-6">
							<Pressable>
								<MaterialIcons
									name="label-outline"
									size={24}
									color="black"
								/>
							</Pressable>
							<Text>{data.label}</Text>
						</View>
						<Pressable>
							{noteData.labels.includes(data.label) && (
								<Pressable
									onPress={() => {
										const newState = {
											...noteData,
											labels: [
												...new Set([
													...noteData.labels.filter(
														label =>
															label !== data.label
													),
												]),
											],
										};
										noteDispatch({
											...newState,
											type: "added",
										});
									}}
								>
									<Ionicons
										name="checkbox"
										size={24}
										color="black"
									/>
								</Pressable>
							)}
							{!noteData.labels.includes(data.label) && (
								<Pressable
									onPress={() => {
										const newState = {
											...noteData,
											labels: [
												...new Set([
													...noteData.labels,
													data.label,
												]),
											],
										};
										noteDispatch({
											...newState,
											type: "added",
										});
									}}
								>
									<MaterialCommunityIcons
										name="checkbox-blank-outline"
										size={24}
										color="black"
									/>
								</Pressable>
							)}
						</Pressable>
					</View>
				))}
			</View>
		);
	}
}
