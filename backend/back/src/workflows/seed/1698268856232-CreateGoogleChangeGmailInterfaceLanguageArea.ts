import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";
import Area from "../../services/entities/area.entity";

export class CreateGoogleChangeGmailInterfaceLanguageArea1698268856232 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "language",
			type: "short-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
            VALUES ('change-gmail-interface-language', 'google', false, 'Change the language of the GMail interface', $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('change-gmail-interface-language', 'google', 'https://www.googleapis.com/auth/gmail.settings.basic', 'google')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: "change-gmail-interface-language",
			serviceId: "google",
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" = 'change-gmail-interface-language'
         AND "service_id" = 'google'`,
		);
	}
}
