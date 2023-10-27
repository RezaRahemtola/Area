import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGoogleServiceScopes1698414179394 implements MigrationInterface {
	private readonly GOOGLE_SERVICE_SCOPES = ["email", "openid"];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.GOOGLE_SERVICE_SCOPES.map((scope) => `('${scope}', 'google')`).join(",")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'google'
         AND "id" IN (${this.GOOGLE_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
