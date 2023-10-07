import { Area, Service } from "@/types/services";

export type Workflow = {
	id: string;
	name: string;
	pictures: string[];
	running: boolean;
};

export type EditorElement = {
	id: string;
	service?: Service;
	account: boolean;
	event?: Area;
};

export type EditorWorkflow = {
	name: string;
	action: EditorElement;
	reactions: EditorElement[];
};
