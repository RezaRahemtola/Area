import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";
import Area from "../../services/entities/area.entity";

export class CreateGoogleSharedDriveArea1698266623053 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "name",
			type: "short-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
            VALUES ('create-shared-drive', 'google', false, 'Create a Google shared drive', $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('create-shared-drive', 'google', 'https://www.googleapis.com/auth/drive', 'google')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: "create-shared-drive",
			serviceId: "google",
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" = 'create-shared-driv'
         AND "service_id" = 'google'`,
		);
	}
}
