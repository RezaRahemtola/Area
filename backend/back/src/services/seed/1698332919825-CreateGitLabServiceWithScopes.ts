import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGitLabServiceWithScopes1698332919825 implements MigrationInterface {
	private readonly GITLAB_SERVICE_SCOPES = [
		"api",
		"read_user",
		"read_api",
		"read_repository",
		"write_repository",
		"read_registry",
		"write_registry",
		"sudo",
		"openid",
		"profile",
		"email",
		"create_runner",
		"k8s_proxy",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('gitlab',
               'https://asset.brandfetch.io/idw382nG0m/idUCpm3axR.svg',
               'https://gitlab.com/oauth/authorize')`,
		);
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.GITLAB_SERVICE_SCOPES.map((scope) => `('${scope}', 'gitlab')`).join(",")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'gitlab'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'gitlab'
         AND "id" IN (${this.GITLAB_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
