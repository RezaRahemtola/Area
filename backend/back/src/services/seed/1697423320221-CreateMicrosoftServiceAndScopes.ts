import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMicrosoftServiceAndScopes1697423320221 implements MigrationInterface {
	private readonly MICROSOFT_SERVICE_SCOPES = [
		"https://graph.microsoft.com/User.Read",
		"https://graph.microsoft.com/Mail.Read",
		"https://onenote.com/Notes.Create",
		"https://onenote.com/Notes.Read",
		"https://onenote.com/Notes.Read.All",
		"https://onenote.com/Notes.ReadWrite",
		"https://onenote.com/Notes.ReadWrite.All",
		"https://onenote.com/Notes.ReadWrite.CreatedByApp",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('microsoft',
               'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png?20210729021049',
               'https://login.microsoftonline.com/common/oauth2/v2.0/authorize')`,
		);

		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.MICROSOFT_SERVICE_SCOPES.map((scope) => `('${scope}', 'microsoft')`).join(", ")}`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'microsoft'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'microsoft'
         AND "id" IN (${this.MICROSOFT_SERVICE_SCOPES.map((scope) => `'${scope}'`).join(",")})`,
		);
	}
}
