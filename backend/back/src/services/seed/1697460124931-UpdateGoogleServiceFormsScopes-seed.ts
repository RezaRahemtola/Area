import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGoogleServiceFormsScopes1697460124931 implements MigrationInterface {
	private readonly OLD_GOOGLE_SERVICE_SCOPES: Array<string> = [
		"https://www.googleapis.com/auth/forms",
		"https://www.googleapis.com/auth/forms.currentonly",
	];
	private readonly NEW_GOOGLE_SERVICE_SCOPES: Array<string> = [
		"https://www.googleapis.com/auth/forms.body",
		"https://www.googleapis.com/auth/forms.body.readonly",
		"https://www.googleapis.com/auth/forms.responses.readonly",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.NEW_GOOGLE_SERVICE_SCOPES.map((scope) => `('${scope}', 'google')`).join(",")}`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'google'
         AND "id" IN (${this.OLD_GOOGLE_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'google'
         AND "id" IN (${this.NEW_GOOGLE_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.OLD_GOOGLE_SERVICE_SCOPES.map((scope) => `('${scope}', 'google')`).join(",")}`,
		);
	}
}
