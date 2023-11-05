import { z } from "zod";
import { Client } from "twitter-api-sdk";
import { credentials } from "@grpc/grpc-js";
import { AreaBackServiceClient } from "../proto/area_back";
import "../proto/google/protobuf/struct";
import { onError, onReaction } from "../util/grpc";
import parseArguments, { TwitterAuthSchema } from "../util/params";
import { TwitterResponseError } from "../util/types";

const CreateTweetSchema = z.object({
	auth: TwitterAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	workflowStepId: z.string(),
	text: z.string(),
});
type CreateTweetType = z.infer<typeof CreateTweetSchema>;

export default async function createTweet() {
	const params = parseArguments<CreateTweetType>(CreateTweetSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());

	try {
		const twitter = new Client(params.auth.access_token);

		await twitter.tweets.createTweet({
			text: params.text,
		});
		await onReaction(client, {
			name: "twitter-create-tweet",
			identifier: params.identifier,
			params: {
				workflowStepId: params.workflowStepId,
			},
		});
	} catch (e) {
		const error = e as TwitterResponseError;
		await onError(client, {
			identifier: params.identifier,
			error: error.error.detail,
			isAuthError: error.status === 401 || error.status === 403,
		});
	}
}
