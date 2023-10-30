import { In, MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";
import Area from "../../services/entities/area.entity";

export class CreateGoogleUpdateSpreadsheetTitleArea1698656017859 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "spreadsheetId",
			type: "short-text",
			required: true,
		},
		{
			name: "title",
			type: "short-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
       VALUES ('update-spreadsheet-title', 'google', false, 'Update a Google Spreadsheet title', $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
       ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
       VALUES ('update-spreadsheet-title', 'google', 'https://www.googleapis.com/auth/spreadsheets', 'google')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: In(["update-spreadsheet-title"]),
			serviceId: In(["google"]),
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" = 'update-spreadsheet-title'
         AND "service_id" = 'google'`,
		);
	}
}
