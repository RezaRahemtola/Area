export type Activity = {
	id: string;
	type: string;
	createdAt: string;
	workflowArea: {
		id: string;
		area: {
			id: string;
			serviceId: string;
		};
	};
	workflow: {
		id: string;
		name: string;
	};
};
