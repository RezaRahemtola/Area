import { In, MigrationInterface, QueryRunner } from "typeorm";
import Area from "../../services/entities/area.entity";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateGoogleCreateDraftMailArea1697391501370 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "to",
			type: "email",
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
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
       VALUES ('create-draft-email', 'google', false, "Create a draft email with Gmail", $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
       ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
       VALUES ('create-draft-email', 'google', 'https://www.googleapis.com/auth/gmail.compose', 'google')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: In(["create-draft-email"]),
			serviceId: In(["google"]),
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" = 'create-draft-email'
         AND "service_id" = 'google'`,
		);
	}
}
