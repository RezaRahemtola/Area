import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateGitlabCommitPRActions1698678924392 implements MigrationInterface {
	private readonly gitlabActionsParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "projectId",
			type: "short-text",
			required: true,
		},
	];

	private readonly gitlabOnCommitParameters: string[] = ["author", "branch", "createdAt", "message", "url"];
	private readonly gitlabOnPullRequestParameters: string[] = [
		"author",
		"base",
		"compare",
		"createdAt",
		"description",
		"title",
		"url",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		const commitParams = `'{${this.gitlabOnCommitParameters.map((v) => `"${v}"`).join(",")}}'`;
		const pullRequestParams = `'{${this.gitlabOnPullRequestParameters.map((v) => `"${v}"`).join(",")}}'`;

		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('on-commit', 'gitlab', true, 'Triggers when an commit is pushed on a Gitlab project', $1, ${commitParams}),
                   ('on-pull-request-close', 'gitlab', true, 'Triggers when a merge request is closed on a Gitlab project', $1, ${pullRequestParams}),
                   ('on-pull-request-create', 'gitlab', true, 'Triggers when a merge request is created on a Gitlab project', $1, ${pullRequestParams}),
                   ('on-pull-request-merge', 'gitlab', true, 'Triggers when a merge request is merged on a Gitlab project', $1, ${pullRequestParams}),
                   ('on-pull-request-reopen', 'gitlab', true, 'Triggers when a merge request is merged on a Gitlab project', $1, ${pullRequestParams})`,
			[JSON.stringify(this.gitlabActionsParametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('on-commit', 'gitlab', 'api', 'gitlab'),
                   ('on-pull-request-close', 'gitlab', 'api', 'gitlab'),
                   ('on-pull-request-create', 'gitlab', 'api', 'gitlab'),
                   ('on-pull-request-merge', 'github', 'api', 'gitlab'),
                   ('on-pull-request-merge', 'gitlab', 'api', 'gitlab')
            `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area" 
                    WHERE service_id = 'gitlab'
                    AND id IN ('on-commit', 'on-pull-request-close', 'on-pull-request-create', 'on-pull-request-merge', 'on-pull-request-reopen')`,
		);
	}
}
