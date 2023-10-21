import { In, MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";
import Area from "../../services/entities/area.entity";

export class DuplicateGoogleDriveFileArea1697902627105 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "fileId",
			type: "short-text",
			required: true,
		},
		{
			name: "name",
			type: "short-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
       VALUES ('duplicate-drive-file', 'google', false, 'Duplicate a file in Google Drive', $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
       ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
       VALUES ('duplicate-drive-file', 'google', 'https://www.googleapis.com/auth/drive', 'google')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: In(["duplicate-drive-file"]),
			serviceId: In(["google"]),
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" = 'duplicate-drive-file'
         AND "service_id" = 'google'`,
		);
	}
}
