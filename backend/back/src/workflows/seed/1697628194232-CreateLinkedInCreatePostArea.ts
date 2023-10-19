import { In, MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";
import Area from "../../services/entities/area.entity";

export class CreateLinkedInCreatePostArea1697628194232 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "content",
			type: "long-text",
			required: true,
		},
		{
			name: "articleLink",
			type: "short-text",
			required: true,
		},
		{
			name: "articleDescription",
			type: "short-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
       VALUES ('create-post', 'linkedin', false, 'Create a new LinkedIn post', $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
		   ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
		   VALUES ('create-post', 'linkedin', 'w_member_social', 'linkedin')`,
		);
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
		   ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
		   VALUES ('create-post', 'linkedin', 'profile', 'linkedin')`,
		);
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
		   ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
		   VALUES ('create-post', 'linkedin', 'email', 'linkedin')`,
		);
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
		   ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
		   VALUES ('create-post', 'linkedin', 'openid', 'linkedin')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: In(["create-post"]),
			serviceId: In(["linkedin"]),
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" = 'create-post'
         AND "service_id" = 'linkedin'`,
		);
	}
}
