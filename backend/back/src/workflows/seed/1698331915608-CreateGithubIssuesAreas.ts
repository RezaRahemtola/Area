import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateGithubIssuesAreas1698331915608 implements MigrationInterface {
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

	private readonly reopenIssueParametersFormFlow: ParametersFormFlowFieldDto[] = [
		...this.githubActionsParametersFormFlow,
		{
			name: "issueNumber",
			type: "integer",
			required: true,
		},
	];

	private readonly closeIssueParametersFormFlow: ParametersFormFlowFieldDto[] = [
		...this.reopenIssueParametersFormFlow,
		{
			name: "completed",
			type: "boolean",
			required: false,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow")
            VALUES ('on-issue-close', 'github', true, 'Triggers when an issue is closed on a Github repository', $1),
                   ('on-issue-reopen', 'github', true, 'Triggers when an issue is reopened on a Github repository', $2),
                   ('close-issue', 'github', false, 'Close an issue on a Github repository', $3),
                   ('reopen-issue', 'github', false, 'Reopen an issue on a Github repository', $4)`,
			[
				JSON.stringify(this.githubActionsParametersFormFlow),
				JSON.stringify(this.githubActionsParametersFormFlow),
				JSON.stringify(this.closeIssueParametersFormFlow),
				JSON.stringify(this.reopenIssueParametersFormFlow),
			],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('on-issue-close', 'github', 'repo', 'github'),
                   ('on-issue-reopen', 'github', 'repo', 'github'),
                   ('close-issue', 'github', 'repo', 'github'),
                   ('reopen-issue', 'github', 'repo', 'github')
                   `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area" 
                    WHERE service_id = 'github'
                    AND id IN ('on-issue-close', 'on-issue-reopen', 'close-issue', 'reopen-issue')`,
		);
	}
}
