import React, { createContext, useContext, useReducer, useState } from "react";

interface TaskType {
	id: string;
	title: string;
	note: string;
	archived: boolean;
	pinned: boolean;
	deleted: boolean;
	labels: string[];
	reminders: [];
}

interface ActionType {
	type: "added" | "deleted";
	id: string;
	title: string;
	note: string;
	archived: boolean;
	pinned: boolean;
	deleted: boolean;
	labels: string[];
	reminders: [];
}

interface label {
	id: string;
	label: string;
}

interface labelActionType {
	id: string;
	label: string;
	type: string;
}

const TaskContext = createContext<TaskType[]>([]);
const TaskDispatchContext = createContext<React.Dispatch<ActionType> | null>(
	null
);
const LabelContext = createContext<label[]>([]);
const LabelDispatchContext =
	createContext<React.Dispatch<labelActionType> | null>(null);
const selectedOptionContext = createContext<string>("");
const setSelectedOptionContext = createContext<React.Dispatch<string> | null>(
	null
);

const initialTasks: TaskType[] = [];
const initialLabels: label[] = [];

export function TasksProvider({ children }: { children: React.ReactNode }) {
	const [tasks, dispatchTask] = useReducer(taskReducer, initialTasks);
	const [labels, dispatchLabel] = useReducer(labelReducer, initialLabels);
	const [selectedOption, setSelectedOption] = useState<string>("");

	return (
		<TaskContext.Provider value={tasks}>
			<TaskDispatchContext.Provider value={dispatchTask}>
				<LabelContext.Provider value={labels}>
					<LabelDispatchContext.Provider value={dispatchLabel}>
						<selectedOptionContext.Provider value={selectedOption}>
							<setSelectedOptionContext.Provider
								value={setSelectedOption}
							>
								{children}
							</setSelectedOptionContext.Provider>
						</selectedOptionContext.Provider>
					</LabelDispatchContext.Provider>
				</LabelContext.Provider>
			</TaskDispatchContext.Provider>
		</TaskContext.Provider>
	);
}

function taskReducer(tasks: TaskType[], action: ActionType): TaskType[] {
	switch (action.type) {
		case "added":
			const existingTaskIndex = tasks.findIndex(t => t.id === action.id);
			if (existingTaskIndex !== -1) {
				console.log('saving: ',tasks[existingTaskIndex].title);
				return tasks.map(task =>
					task.id === action.id
						? {
							...task,
							labels: [...action.labels],
						}
						: task
				);
			}
			return [
				...tasks,
				{
					id: action.id,
					title: action.title,
					note: action.note,
					pinned: action.pinned,
					archived: action.archived,
					deleted: action.deleted,
					labels: action.labels,
					reminders: [],
				},
			];
		case "deleted":
			return tasks.filter(t => t.id !== action.id);
		default:
			throw new Error("Unknown action: " + action.type);
	}
}

function labelReducer(tasks: label[], action: labelActionType): label[] {
	switch (action.type) {
		case "added":
			const existingTaskIndex = tasks.findIndex(t => t.id === action.id);
			if (existingTaskIndex !== -1) {
				return tasks.map(task =>
					task.id === action.id
						? {
								...task,
								label: action.label,
						  }
						: task
				);
			}
			return [
				...tasks,
				{
					id: action.id,
					label: action.label,
				},
			];
		case "deleted":
			return tasks.filter(t => t.id !== action.id);
		default:
			throw new Error("Unknown action: " + action.type);
	}
}

export function useTasksDispatch(): React.Dispatch<ActionType> {
	const context = useContext(TaskDispatchContext);
	if (!context) {
		throw new Error("useTasksDispatch must be used within a TasksProvider");
	}
	return context;
}

export function useTasks(selectedOption: string, labels: label[]): TaskType[] {
	const data = useContext(TaskContext);
	switch (selectedOption) {
		case "all":
			return data;
		case "Deleted":
			return data.filter(ele => ele.deleted);
		case "Archive":
			return data.filter(ele => ele.archived);
		case "Reminders":
			return data.filter(
				ele => ele.reminders && ele.reminders.length !== 0
			);
		default: {
			if (selectedOption === "Notes") {
				return data.filter(
					ele =>
						ele.labels.length === 0 && !ele.archived && !ele.deleted
				);
			}
			const labelText = labels.map(data => data.label);
			const isLabel = labelText.includes(selectedOption);
			return data.filter(
				ele =>
					(!isLabel || ele.labels.includes(selectedOption)) &&
					!ele.deleted
			);
		}
	}
}

export function useLabelsDispatch(): React.Dispatch<labelActionType> {
	const context = useContext(LabelDispatchContext);
	if (!context) {
		throw new Error("useTasksDispatch must be used within a TasksProvider");
	}
	return context;
}

export function useLabels(): label[] {
	return useContext(LabelContext);
}

export function useSelectedDispatch(): React.Dispatch<string> {
	const context = useContext(setSelectedOptionContext);
	if (!context) {
		throw new Error("useTasksDispatch must be used within a TasksProvider");
	}
	return context;
}

export function useSelected(): string {
	return useContext(selectedOptionContext);
}
