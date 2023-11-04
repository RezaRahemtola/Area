import { z } from "zod";
import { credentials } from "@grpc/grpc-js";
import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import { AreaBackServiceClient } from "../proto/area_back";
import "../proto/google/protobuf/struct";
import { onError, onReaction } from "../util/grpc";
import parseArguments, { MicrosoftAuthSchema } from "../util/params";
import { AccessTokenProvider, MicrosoftResponseError } from "../util/types";

const SendEmailSchema = z.object({
	auth: MicrosoftAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	workflowStepId: z.string(),
	to: z.string(),
	subject: z.string(),
	body: z.string(),
});
type SendEmailType = z.infer<typeof SendEmailSchema>;

export default async function sendEmail() {
	const params = parseArguments<SendEmailType>(SendEmailSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());

	try {
		const authProvider = new AccessTokenProvider(params.auth.access_token);
		const clientOptions: ClientOptions = {
			authProvider,
		};
		const graphClient = Client.initWithMiddleware(clientOptions);
		const mail = await graphClient.api("/me/sendMail").post({
			message: {
				subject: params.subject,
				body: {
					contentType: "text",
					content: params.body,
				},
				toRecipients: [
					{
						emailAddress: {
							address: params.to,
						},
					},
				],
			},
		});

		await onReaction(client, {
			name: "microsoft-outlook-send-email",
			identifier: params.identifier,
			params: {
				workflowStepId: params.workflowStepId,
			},
		});
	} catch (e) {
		const error = e as MicrosoftResponseError;
		await onError(client, {
			identifier: params.identifier,
			error: JSON.parse(error.body).message,
			isAuthError: error.statusCode === 401 || error.statusCode === 403,
		});
		process.exit(1);
	}
}
