import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateSlackCreateMessageReaction1699131357051 implements MigrationInterface {
	private readonly slackCreateMessageParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "text",
			type: "long-text",
			required: true,
		},
		{
			name: "channelId",
			type: "short-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('create-message', 'slack', false, 'Post a message on a Slack channel', $1, '{}')`,
			[JSON.stringify(this.slackCreateMessageParametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('create-message', 'slack', 'chat:write', 'slack')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area"
             WHERE service_id = 'slack'
				AND id IN ('create-message');
             `,
		);
	}
}
