import { Area, Service } from "@/types/services";

export type Workflow = {
	id: string;
	name: string;
	pictures: string[];
	running: boolean;
};

export type EditorElement = {
	service: Service;
	event: Area;
};

export type EditorWorkflow = {
	name: string;
	action?: EditorElement;
	reactions: (EditorElement | undefined)[];
};
