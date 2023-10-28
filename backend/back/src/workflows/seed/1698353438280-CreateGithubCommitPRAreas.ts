import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateGithubCommitPRAreas1698353438280 implements MigrationInterface {
	private readonly githubActionsParametersFormFlow: ParametersFormFlowFieldDto[] = [
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
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
            VALUES ('on-commit', 'github', true, 'Triggers when an commit is pushed on a Github repository', $1),
                   ('on-pull-request-close', 'github', true, 'Triggers when a pull request is closed on a Github repository', $1),
                   ('on-pull-request-create', 'github', true, 'Triggers when a pull request is created on a Github repository', $1),
                   ('on-pull-request-merge', 'github', true, 'Triggers when a pull request is merged on a Github repository', $1)`,
			[JSON.stringify(this.githubActionsParametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('on-commit', 'github', 'repo', 'github'),
                   ('on-pull-request-close', 'github', 'repo', 'github'),
                   ('on-pull-request-create', 'github', 'repo', 'github'),
                   ('on-pull-request-merge', 'github', 'repo', 'github')
            `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area" 
                    WHERE service_id = 'github'
                    AND id IN ('on-commit', 'on-pull-request-close', 'on-pull-request-create', 'on-pull-request-merge')`,
		);
	}
}
