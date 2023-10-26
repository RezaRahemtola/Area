import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLinearServiceWithScopes1698322805180 implements MigrationInterface {
	private readonly LINEAR_SERVICE_SCOPES = ["read", "write", "issues:create", "comments:create", "admin"];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('linear',
               'https://asset.brandfetch.io/iduDa181eM/id0tTqetsg.svg',
               'https://linear.app/oauth/authorize')`,
		);
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.LINEAR_SERVICE_SCOPES.map((scope) => `('${scope}', 'linear')`).join(",")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'linear'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'linear'
         AND "id" IN (${this.LINEAR_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
