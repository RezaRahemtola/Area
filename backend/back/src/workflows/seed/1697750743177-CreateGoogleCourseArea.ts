import { In, MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";
import Area from "../../services/entities/area.entity";

export class CreateGoogleCourseArea1697750743177 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "name",
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
       VALUES ('create-course', 'google', false, 'Create a new Google Classroom course', $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
       ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
       VALUES ('create-course', 'google', 'https://www.googleapis.com/auth/classroom.courses', 'google')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: In(["create-course"]),
			serviceId: In(["google"]),
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" = 'create-course'
         AND "service_id" = 'google'`,
		);
	}
}
