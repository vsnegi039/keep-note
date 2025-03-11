import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";
import DatePicker from "react-native-date-picker";

export default function AddReminder({
	setisReminder,
}: {
	setisReminder: (value: boolean) => void;
}) {
	const [date, setDate] = useState(new Date());
	const [open, setOpen] = useState(false);
	const dataOptions = [
		{ text: "Later today", time: "6:00 pm" },
		{ text: "Tommorow morning", time: "8:00 am" },
		{ text: "Monday morning", time: "Mon, 8:00 am" },
	];

	return (
		<Pressable
			onPress={() => setisReminder(false)}
			className="fixed h-full w-full top-0 left-0 bg-gray-400 flex-row items-end"
		>
			<View className="w-full bg-white rounded-s-3xl">
				<View className="p-3 border-b border-gray-200">
					<Text className="text-xl font-bold">Remind me later</Text>
					<Text>Saved in Google Reminders</Text>
				</View>
				<View className="mt-3">
					{dataOptions.map((data, i) => {
						return (
							<View
								className="flex-row p-3 justify-between items-center"
								key={i}
							>
								<View className="w-1/2 flex-row gap-3 items-center">
									<Feather
										name="clock"
										size={24}
										color="black"
									/>
									<Text>{data.text}</Text>
								</View>
								<View className="w-1/2 items-end">
									<Text className="text-end">
										{data.time}
									</Text>
								</View>
							</View>
						);
					})}
					<View className="w-1/2 p-3 flex-row gap-3 items-center">
						<Feather name="clock" size={24} color="black" />
						<Text>Choose a date & time</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);
}
