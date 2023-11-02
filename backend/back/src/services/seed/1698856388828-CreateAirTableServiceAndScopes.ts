import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAirTableServiceAndScopes1698856388828 implements MigrationInterface {
	private readonly AIRTABLE_SERVICE_SCOPES = [
		"data.records:read",
		"data.records:write",
		"data.recordComments:read",
		"data.recordComments:write",
		"schema.bases:read",
		"schema.bases:write",
		"webhook:manage",
		"block:manage",
		"user.email:read",
		"enterprise.groups:read",
		"workspacesAndBases:read",
		"workspacesAndBases:write",
		"workspacesAndBases:manage",
		"workspacesAndBases.shares:manage",
		"enterprise.scim.usersAndGroups:manage",
		"enterprise.auditLogs:read",
		"enterprise.changeEvents:read",
		"enterprise.account:read",
		"enterprise.user:read",
		"enterprise.user:write",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('airtable',
               'https://asset.brandfetch.io/iddsnRzkxS/iddyj0wl13.svg',
               'https://airtable.com/oauth2/v1/authorize')`,
		);
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.AIRTABLE_SERVICE_SCOPES.map((scope) => `('${scope}', 'airtable')`).join(",")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'airtable'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'airtable'
         AND "id" IN (${this.AIRTABLE_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
