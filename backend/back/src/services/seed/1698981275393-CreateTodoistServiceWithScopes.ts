import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTodoistServiceWithScopes1698981275393 implements MigrationInterface {
	private readonly TODOIST_SERVICE_SCOPES = [
		"task:add",
		"data:read",
		"data:read_write",
		"data:delete",
		"project:delete",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('todoist',
               'https://www.svgrepo.com/download/354452/todoist-icon.svg',
               'https://todoist.com/oauth/authorize')`,
		);
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.TODOIST_SERVICE_SCOPES.map((scope) => `('${scope}', 'todoist')`).join(",")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'todoist'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'todoist'
         AND "id" IN (${this.TODOIST_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
