import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";
import Area from "../../services/entities/area.entity";

export class CreateGoogleFormUpdateDescriptionArea1698654637708 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "formId",
			type: "short-text",
			required: true,
		},
		{
			name: "description",
			type: "long-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
            VALUES ('form-update-description', 'google', false, 'Update the description of a Google Form', $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('form-update-description', 'google', 'https://www.googleapis.com/auth/forms.body', 'google')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: "form-update-description",
			serviceId: "google",
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" = 'form-update-description'
         AND "service_id" = 'google'`,
		);
	}
}
