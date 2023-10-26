import { Octokit, RequestError } from "octokit";
import { z } from "zod";
import { credentials } from "@grpc/grpc-js";
import parseArguments, { getFromEnv, GithubAuthSchema } from "../util/params";
import { GithubErrorData } from "../util/types";
import { onError } from "../util/grpc";
import { AreaBackServiceClient } from "../proto/area_back";

const SetupWebhookSchema = z.object({
	auth: GithubAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	owner: z.string(),
	repo: z.string(),
});
type SetupWebhookType = z.infer<typeof SetupWebhookSchema>;

export default async function setupWebhook() {
	const params = parseArguments<SetupWebhookType>(SetupWebhookSchema);
	const octokit = new Octokit({
		auth: params.auth.access_token,
	});
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const url = getFromEnv("GITHUB_WEBHOOK_URL");
	const secret = getFromEnv("GITHUB_WEBHOOK_SECRET");

	try {
		const webhooks = await octokit.rest.repos.listWebhooks({
			owner: params.owner,
			repo: params.repo,
		});

		if (!webhooks.data.find((w) => w.config.url === url)) {
			await octokit.rest.repos.createWebhook({
				owner: params.owner,
				repo: params.repo,
				events: ["*"],
				active: true,
				config: {
					url,
					secret,
					content_type: "json",
				},
			});
		}
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
