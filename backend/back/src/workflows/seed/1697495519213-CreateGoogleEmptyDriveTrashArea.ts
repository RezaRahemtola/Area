import { In, MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";
import Area from "../../services/entities/area.entity";

export class CreateGoogleEmptyDriveTrashArea1697495519213 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
       VALUES ('empty-drive-trash', 'google', false, 'Empty the Google Drive trash', $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
       ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
       VALUES ('empty-drive-trash', 'google', 'https://www.googleapis.com/auth/drive.file', 'google')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: In(["empty-drive-trash"]),
			serviceId: In(["google"]),
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" = 'empty-drive-trash'
         AND "service_id" = 'google'`,
		);
	}
}
