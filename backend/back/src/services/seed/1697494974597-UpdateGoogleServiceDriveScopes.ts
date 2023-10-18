import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGoogleServiceDriveScopes1697494974597 implements MigrationInterface {
	private readonly NEW_GOOGLE_SERVICE_SCOPES: Array<string> = [
		"https://www.googleapis.com/auth/docs",
		"https://www.googleapis.com/auth/drive.apps.readonly",
		"https://www.googleapis.com/auth/drive.apps",
		"https://www.googleapis.com/auth/drive.install",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.NEW_GOOGLE_SERVICE_SCOPES.map((scope) => `('${scope}', 'google')`).join(",")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'google'
         AND "id" IN (${this.NEW_GOOGLE_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
