import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLinkedInServiceAndScopes1697410039086 implements MigrationInterface {
	private readonly LINKEDIN_SERVICE_SCOPES = [
		"r_compliance",
		"w_compliance",
		"r_liteprofile",
		"r_basicprofile",
		"r_compliance_2l",
		"r_emailaddress",
		"r_primarycontact",
		"r_1st_connections",
		"w_organization_social",
		"r_organization_social",
		"w_member_social",
		"r_member_social",
		"rw_ads",
		"rw_organization_admin",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('linkedin',
               'https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg',
               'https://www.linkedin.com/oauth/v2/authorization')`,
		);

		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.LINKEDIN_SERVICE_SCOPES.map((scope) => `('${scope}', 'linkedin')`).join(", ")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'linkedin'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'linkedin'
         AND "id" IN (${this.LINKEDIN_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
