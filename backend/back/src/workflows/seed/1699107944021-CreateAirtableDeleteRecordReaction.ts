import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateAirtableDeleteRecordReaction1699107944021 implements MigrationInterface {
	private readonly airtableDeleteRecordParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "baseId",
			type: "short-text",
			required: true,
		},
		{
			name: "tableId",
			type: "short-text",
			required: true,
		},
		{
			name: "recordId",
			type: "short-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('delete-record', 'airtable', false, 'Delete a record from an Airtable base table', $1, '{}')`,
			[JSON.stringify(this.airtableDeleteRecordParametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('delete-record', 'airtable', 'data.records:write', 'airtable')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area"
             WHERE service_id = 'airtable'
				AND id IN ('delete-record');
             `,
		);
	}
}
