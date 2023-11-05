import { z } from "zod";
import { credentials } from "@grpc/grpc-js";
import { LinearClient } from "@linear/sdk";
import { AreaBackServiceClient } from "../proto/area_back";
import "../proto/google/protobuf/struct";
import { onError, onReaction } from "../util/grpc";
import parseArguments, { LinearAuthSchema } from "../util/params";
import { LinearErrorData } from "../util/types";

const PriorityArray = ["Urgent", "High", "Medium", "Low"];

const CreateIssueSchema = z.object({
	auth: LinearAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	workflowStepId: z.string(),
	title: z.string(),
	description: z.string().optional(),
	estimate: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().nonnegative()).optional(),
	priority: z
		.preprocess((a) => {
			const priority = z.string().parse(a);
			return PriorityArray.indexOf(priority) + 1;
		}, z.number().min(1).max(4))
		.optional(),
});
type CreateIssueType = z.infer<typeof CreateIssueSchema>;

export default async function createIssue() {
	const params = parseArguments<CreateIssueType>(CreateIssueSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());

	try {
		const linearClient = new LinearClient({
			accessToken: params.auth.access_token,
		});
		const teams = await linearClient.teams();

		const res = await linearClient.createIssue({
			teamId: teams.nodes[0]!.id,
			title: params.title,
			description: params.description,
			estimate: params.estimate,
			priority: params.priority,
		});
		const issue = await res.issue;
		await onReaction(client, {
			name: "linear-create-issue",
			identifier: params.identifier,
			params: {
				workflowStepId: params.workflowStepId,
				url: issue?.url,
			},
		});
	} catch (e) {
		const error = e as LinearErrorData;
		await onError(client, {
			identifier: params.identifier,
			error: error.errors[0].message,
			isAuthError: error.type === "AuthenticationError",
		});
	}
}
