import { In, MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";
import Area from "../../services/entities/area.entity";

export class CreateGoogleFormYoutubeItem1697907107855 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "formId",
			type: "short-text",
			required: true,
		},
		{
			name: "title",
			type: "short-text",
			required: true,
		},
		{
			name: "description",
			type: "long-text",
			required: true,
		},
		{
			name: "youtubeUrl",
			type: "short-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
       VALUES ('form-add-youtube-item', 'google', false, 'Add a YouTube item in a Google Form', $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
       ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
       VALUES ('form-add-youtube-item', 'google', 'https://www.googleapis.com/auth/forms.body', 'google')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: In(["form-add-youtube-item"]),
			serviceId: In(["google"]),
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" = 'form-add-youtube-item'
         AND "service_id" = 'google'`,
		);
	}
}
