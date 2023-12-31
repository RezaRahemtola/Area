import { z } from "zod";
import { credentials } from "@grpc/grpc-js";
import { TodoistApi, TodoistRequestError } from "@doist/todoist-api-typescript";
import { AreaBackServiceClient } from "../proto/area_back";
import "../proto/google/protobuf/struct";
import { onError, onReaction } from "../util/grpc";
import parseArguments, { TodoistAuthSchema } from "../util/params";

const UpdateTaskSchema = z.object({
	auth: TodoistAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	workflowStepId: z.string(),
	id: z.string(),
	content: z.string().optional(),
	description: z.string().optional(),
	priority: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().min(1).max(4)).optional(),
	dueDate: z.string().optional(),
});
type UpdateTaskType = z.infer<typeof UpdateTaskSchema>;

export default async function updateTask() {
	const params = parseArguments<UpdateTaskType>(UpdateTaskSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());

	try {
		const todoist = new TodoistApi(params.auth.access_token);
		const task = await todoist.updateTask(params.id, {
			content: params.content,
			description: params.description,
			priority: params.priority,
			dueString: params.dueDate,
		});

		await onReaction(client, {
			name: "todoist-update-task",
			identifier: params.identifier,
			params: {
				workflowStepId: params.workflowStepId,
				url: task.url,
			},
		});
	} catch (e) {
		const error = e as TodoistRequestError;
		await onError(client, {
			identifier: params.identifier,
			error: error.responseData?.toString() ?? error.message,
			isAuthError: error.httpStatusCode === 401 || error.httpStatusCode === 403,
		});
	}
}
