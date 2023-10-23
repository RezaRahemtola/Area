import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";
import Area from "../../services/entities/area.entity";

export class CreateIssueGithubReaction1698062010534 implements MigrationInterface {
	private readonly parametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "owner",
			type: "short-text",
			required: true,
		},
		{
			name: "repo",
			type: "short-text",
			required: true,
		},
		{
			name: "title",
			type: "short-text",
			required: true,
		},
		{
			name: "body",
			type: "long-text",
			required: false,
		},
		{
			name: "assignees",
			type: "text-array",
			required: false,
		},
		{
			name: "labels",
			type: "text-array",
			required: false,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
            VALUES ('create-issue', 'github', false, 'Create an issue on a Github repository', $1)`,
			[JSON.stringify(this.parametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('create-issue', 'github', 'repo', 'github')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: "create-issue",
			serviceId: "github",
		});
	}
}
