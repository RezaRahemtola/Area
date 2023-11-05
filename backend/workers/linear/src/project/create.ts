import { z } from "zod";
import { credentials } from "@grpc/grpc-js";
import { LinearClient } from "@linear/sdk";
import { AreaBackServiceClient } from "../proto/area_back";
import "../proto/google/protobuf/struct";
import { onError, onReaction } from "../util/grpc";
import parseArguments, { LinearAuthSchema } from "../util/params";
import { LinearErrorData } from "../util/types";

const CreateProjectSchema = z.object({
	auth: LinearAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	workflowStepId: z.string(),
	name: z.string(),
	description: z.string().optional(),
});
type CreateProjectType = z.infer<typeof CreateProjectSchema>;

export default async function createProject() {
	const params = parseArguments<CreateProjectType>(CreateProjectSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());

	try {
		const linearClient = new LinearClient({
			accessToken: params.auth.access_token,
		});
		const teams = await linearClient.teams();

		const res = await linearClient.createProject({
			teamIds: teams.nodes.map((t) => t.id),
			name: params.name,
			description: params.description,
		});
		const project = await res.project;
		await onReaction(client, {
			name: "linear-create-project",
			identifier: params.identifier,
			params: {
				workflowStepId: params.workflowStepId,
				url: project?.url,
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
