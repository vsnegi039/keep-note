import {
	Ionicons,
	FontAwesome,
	AntDesign,
	FontAwesome6,
	Feather,
	MaterialIcons,
} from "@expo/vector-icons";
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
import tw from "tailwind-react-native-classnames";
import { useRouter } from "expo-router";
import { useLabels, useSelectedDispatch, useSelected } from "@/hooks/taskList";

function OptionElement({
	data,
	selectedOption,
	setSelectedOption,
	closeSidebar,
}: {
	data: { text: string; icon: JSX.Element };
	selectedOption: boolean;
	setSelectedOption: (ele: string) => void;
	closeSidebar: () => void;
}) {
	return (
		<TouchableOpacity
			className={`flex-row items-center py-3 px-5 rounded-lg gap-3 ${
				selectedOption ? "bg-gray-300" : ""
			}`}
			onPress={() => {
				setSelectedOption(data.text);
				closeSidebar();
			}}
		>
			{data.icon}
			<Text>{data.text}</Text>
		</TouchableOpacity>
	);
}

export default function Sidebar({
	sidebarState,
	closeSidebar,
}: {
	sidebarState: boolean;
	closeSidebar: () => void;
}) {
	const setSelectedOption = useSelectedDispatch();
	const selectedOption = useSelected();
	const router = useRouter();
	const optionsData = [
		{
			text: "Notes",
			icon: <AntDesign name="bulb1" size={24} color="black" />,
		},
		{
			text: "Reminders",
			icon: <FontAwesome name="bell-o" size={24} color="black" />,
		},
	];
	const optionsData2 = [
		{
			text: "Archive",
			icon: <Ionicons name="archive-outline" size={24} color="black" />,
		},
		{
			text: "Deleted",
			icon: <FontAwesome6 name="trash-alt" size={24} color="black" />,
		},
		// {
		// 	text: "Settings",
		// 	icon: <Ionicons name="settings" size={24} color="black" />,
		// },
		// {
		// 	text: "Help & feedback",
		// 	icon: <Feather name="help-circle" size={24} color="black" />,
		// },
	];
	const labelData = {
		text: "Create new label",
		icon: <FontAwesome6 name="add" size={24} color="black" />,
	};
	const labels = useLabels();
	const labelIcon = (
		<MaterialIcons name="label-outline" size={24} color="black" />
	);
	const options = optionsData.map((option, i) => (
		<OptionElement
			key={i}
			data={option}
			selectedOption={selectedOption === option.text}
			setSelectedOption={setSelectedOption}
			closeSidebar={closeSidebar}
		/>
	));
	const options2 = optionsData2.map((option, i) => (
		<OptionElement
			key={i}
			data={option}
			selectedOption={selectedOption === option.text}
			setSelectedOption={setSelectedOption}
			closeSidebar={closeSidebar}
		/>
	));
	return (
		<>
			{sidebarState && (
				<TouchableOpacity
					className="h-full w-full absolute top-0 left-0"
					onPress={closeSidebar}
					style={{ zIndex: 1 }}
				/>
			)}
			<View
				className={`h-full bg-gray-200 w-3/4 z-[111111] ${
					!sidebarState ? "hidden" : ""
				}`}
			>
				<View className="flex flex-col mt-14">
					{options}
					{!(labels.length > 0) && (
						<TouchableOpacity
							className={`flex-row items-center py-3 px-5 rounded-lg gap-3`}
							onPress={() => {
								router.push(
									"/editlabel?adding=true&editing=true"
								);
								closeSidebar();
							}}
						>
							{labelData.icon}
							<Text>{labelData.text}</Text>
						</TouchableOpacity>
					)}
					{labels.length > 0 && (
						<View className="border-y">
							<View className="flex-row py-3 px-5 justify-between">
								<Text>Labels</Text>
								<Pressable
									onPress={() =>
										router.push(
											"/editlabel?addLabel=true&isEditing=true"
										)
									}
								>
									<Text>Edit</Text>
								</Pressable>
							</View>
							{labels.map(data => (
								<OptionElement
									key={data.id}
									data={{ text: data.label, icon: labelIcon }}
									selectedOption={
										selectedOption === data.label
									}
									setSelectedOption={setSelectedOption}
									closeSidebar={closeSidebar}
								/>
							))}

							<TouchableOpacity
								className={`flex-row items-center py-3 px-5 rounded-lg gap-3`}
								onPress={() => {
									router.push(
										"/editlabel?addLabel=true&isEditing=true"
									);
									closeSidebar();
								}}
							>
								{labelData.icon}
								<Text>{labelData.text}</Text>
							</TouchableOpacity>
						</View>
					)}
					{options2}
				</View>
			</View>
		</>
	);
}
