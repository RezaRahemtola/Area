import { z } from "zod";
import { credentials } from "@grpc/grpc-js";
import { TodoistApi, TodoistRequestError } from "@doist/todoist-api-typescript";
import { AreaBackServiceClient } from "../proto/area_back";
import "../proto/google/protobuf/struct";
import { onError, onReaction } from "../util/grpc";
import parseArguments, { TodoistAuthSchema } from "../util/params";

const CloseTaskSchema = z.object({
	auth: TodoistAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	workflowStepId: z.string(),
	id: z.string(),
});
type CloseTaskType = z.infer<typeof CloseTaskSchema>;

export default async function deleteTask() {
	const params = parseArguments<CloseTaskType>(CloseTaskSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());

	try {
		const todoist = new TodoistApi(params.auth.access_token);

		await todoist.closeTask(params.id);
		await onReaction(client, {
			name: "todoist-delete-task",
			identifier: params.identifier,
			params: {
				workflowStepId: params.workflowStepId,
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
