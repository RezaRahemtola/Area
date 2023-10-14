import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGithubServiceScopes1696697647435 implements MigrationInterface {
	private readonly GITHUB_SERVICE_SCOPES: Array<string> = [
		"repo",
		"repo:status",
		"repo_deployment",
		"public_repo",
		"repo:invite",
		"security_events",
		"admin:repo_hook",
		"write:repo_hook",
		"read:repo_hook",
		"admin:org",
		"write:org",
		"read:org",
		"admin:public_key",
		"write:public_key",
		"read:public_key",
		"admin:org_hook",
		"gist",
		"notifications",
		"user",
		"read:user",
		"user:email",
		"user:follow",
		"project",
		"read:project",
		"delete_repo",
		"write:packages",
		"read:packages",
		"delete:packages",
		"admin:gpg_key",
		"write:gpg_key",
		"read:gpg_key",
		"codespace",
		"workflow",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.GITHUB_SERVICE_SCOPES.map((scope) => `('${scope}', 'github')`).join(",")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'github'
         AND "id" IN (${this.GITHUB_SERVICE_SCOPES.join(",")}`,
		);
	}
}
