import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateOutlookSendEmailReaction1699126617355 implements MigrationInterface {
	private readonly microsoftSendEmailParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "to",
			type: "short-text",
			required: true,
		},
		{
			name: "subject",
			type: "short-text",
			required: true,
		},
		{
			name: "body",
			type: "long-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('send-email', 'microsoft-outlook', false, 'Send an email with Microsoft Outlook', $1, '{}')`,
			[JSON.stringify(this.microsoftSendEmailParametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('send-email', 'microsoft-outlook', 'Mail.Send', 'microsoft-outlook')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area"
             WHERE service_id = 'twitter'
				AND id IN ('create-tweet');
             `,
		);
	}
}
