import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMiroServiceWithScopes1697776146331 implements MigrationInterface {
	private readonly MIRO_SERVICE_SCOPES = [
		"boards:read",
		"boards:write",
		"identity:read",
		"identity:write",
		"team:read",
		"team:write",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('miro',
               'https://brandfetch.com/miro.com/library/default/asset/id1rEl70oX?collection=logos&view=overview',
               'https://miro.com/oauth/authorize')`,
		);
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.MIRO_SERVICE_SCOPES.map((scope) => `('${scope}', 'miro')`).join(",")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'miro'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'miro'
         AND "id" IN (${this.MIRO_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
