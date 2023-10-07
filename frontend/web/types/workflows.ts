export type WorkflowAction = {
	id: string;
	parameters: Record<string, never>;
	areaId: string;
	areaServiceId: string;
};

export type WorkflowReaction = WorkflowAction & {
	previousAreaId: string;
};

export type Workflow = {
	id: string;
	name: string;
	action: WorkflowAction;
	reactions: WorkflowReaction[];
	active: boolean;
};

export type EditorWorkflowAction = {
	id: string;
	parameters: Record<string, never>;
	areaId?: string;
	areaServiceId?: string;
};

export type EditorWorkflowReaction = EditorWorkflowAction & {
	previousAreaId: string;
};

export type EditorWorkflow = {
	id?: string;
	name: string;
	action: EditorWorkflowAction;
	reactions: EditorWorkflowReaction[];
	active: boolean;
};
