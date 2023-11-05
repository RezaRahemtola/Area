import Airtable from "airtable";
import AirtableError from "airtable/lib/airtable_error";
import { z } from "zod";
import { credentials } from "@grpc/grpc-js";
import parseArguments, { AirtableAuthSchema } from "../util/params";
import { AreaBackServiceClient } from "../proto/area_back";
import "../proto/google/protobuf/struct";
import { onError, onReaction } from "../util/grpc";

const DeleteRecordSchema = z.object({
	auth: AirtableAuthSchema,
	target: z.string().optional(),
	identifier: z.string(),
	workflowStepId: z.string(),
	baseId: z.string(),
	tableId: z.string(),
	recordId: z.string(),
});
type DeleteRecordType = z.infer<typeof DeleteRecordSchema>;

export default async function deleteRecord() {
	const params = parseArguments<DeleteRecordType>(DeleteRecordSchema);
	const client = new AreaBackServiceClient(params.target ?? "localhost:50050", credentials.createInsecure());
	const airtable = new Airtable({
		apiKey: params.auth.access_token,
	});

	try {
		const base = airtable.base(params.baseId);
		const table = base.table(params.tableId);

		await table.destroy(params.recordId);
		await onReaction(client, {
			name: "airtable-delete-record",
			identifier: params.identifier,
			params: {
				workflowStepId: params.workflowStepId,
			},
		});
	} catch (e) {
		const error = e as AirtableError;
		await onError(client, {
			identifier: params.identifier,
			error: error.message,
			isAuthError: error.statusCode === 401 || error.statusCode === 403,
		});
		process.exit(1);
	}
}
