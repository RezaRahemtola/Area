import { z } from "zod";
import { Octokit, RequestError } from "octokit";
import { credentials } from "@grpc/grpc-js";
import parseArguments, { GithubAuthSchema } from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import "../proto/google/protobuf/struct";
import { GithubErrorData } from "../util/types";
import { onError, onReaction } from "../util/grpc";

const CloseIssueSchema = z.object({
	auth: GithubAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	workflowStepId: z.string(),
	owner: z.string(),
	repo: z.string(),
	completed: z.boolean().optional().default(true),
	issueNumber: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive()),
});
type CloseIssueType = z.infer<typeof CloseIssueSchema>;

export default async function closeIssue() {
	const params = parseArguments<CloseIssueType>(CloseIssueSchema);
	const octokit = new Octokit({
		auth: params.auth.access_token,
	});
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());

	try {
		const res = await octokit.rest.issues.update({
			owner: params.owner,
			repo: params.repo,
			issue_number: params.issueNumber,
			state: "closed",
			state_reason: params.completed ? "completed" : "not_planned",
		});
		await onReaction(client, {
			name: "github-close-issue",
			identifier: params.identifier,
			params: {
				workflowStepId: params.workflowStepId,
				url: res.data.url,
			},
		});
	} catch (e) {
		if (e instanceof RequestError) {
			const data: GithubErrorData | undefined = e.response?.data as GithubErrorData;
			await onError(client, {
				identifier: params.identifier,
				error: data.message,
				isAuthError: e.status === 401 || e.status === 403,
			});
		}
	}
}
