import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";
import Area from "../../services/entities/area.entity";

export class CreateGoogleFormConvertToQuizArea1698655334570 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "formId",
			type: "short-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
            VALUES ('form-convert-to-quiz', 'google', false, 'Convert a Google Form to a graded quiz', $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('form-convert-to-quiz', 'google', 'https://www.googleapis.com/auth/forms.body', 'google')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: "form-convert-to-quiz",
			serviceId: "google",
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" = 'form-convert-to-quiz'
         AND "service_id" = 'google'`,
		);
	}
}
