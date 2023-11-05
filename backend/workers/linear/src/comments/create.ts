import { z } from "zod";
import { credentials } from "@grpc/grpc-js";
import { LinearClient } from "@linear/sdk";
import { AreaBackServiceClient } from "../proto/area_back";
import "../proto/google/protobuf/struct";
import { onError, onReaction } from "../util/grpc";
import parseArguments, { LinearAuthSchema } from "../util/params";
import { LinearErrorData } from "../util/types";

const CreateCommentSchema = z.object({
	auth: LinearAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	workflowStepId: z.string(),
	body: z.string(),
	issueNumber: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive()),
});
type CreateCommentType = z.infer<typeof CreateCommentSchema>;

export default async function createComment() {
	const params = parseArguments<CreateCommentType>(CreateCommentSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());

	try {
		const linearClient = new LinearClient({
			accessToken: params.auth.access_token,
		});
		const issues = await linearClient.issues();
		const target = issues.nodes.find((i) => i.number === params.issueNumber);
		if (!target) return;

		await linearClient.createComment({
			body: params.body,
			issueId: target.id,
		});
		await onReaction(client, {
			name: "linear-create-comment",
			identifier: params.identifier,
			params: {
				workflowStepId: params.workflowStepId,
			},
		});
	} catch (e) {
		const error = e as LinearErrorData;
		await onError(client, {
			identifier: params.identifier,
			error: error.errors[0].message,
			isAuthError: error.type === "AuthenticationError",
		});
		process.exit(1);
	}
}
