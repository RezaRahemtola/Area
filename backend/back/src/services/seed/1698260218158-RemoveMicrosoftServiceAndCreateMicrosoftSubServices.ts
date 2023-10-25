import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveMicrosoftServiceAndCreateMicrosoftSubServices1698260218158 implements MigrationInterface {
	private readonly OLD_MICROSOFT_SERVICE_SCOPES = [
		"https://graph.microsoft.com/User.Read",
		"https://graph.microsoft.com/Mail.Read",
		"https://onenote.com/Notes.Create",
		"https://onenote.com/Notes.Read",
		"https://onenote.com/Notes.Read.All",
		"https://onenote.com/Notes.ReadWrite",
		"https://onenote.com/Notes.ReadWrite.All",
		"https://onenote.com/Notes.ReadWrite.CreatedByApp",
		"profile",
		"openid",
		"email",
	];

	private readonly MICROSOFT_SUBSERVICES: Array<{
		name: string;
		imageUrl: string;
		scopes: Array<string>;
		prefix: string;
	}> = [
		{
			name: "microsoft-graph",
			imageUrl: "https://asset.brandfetch.io/idchmboHEZ/iduap5ndHF.svg",
			scopes: ["User.Read", "Mail.Read"],
			prefix: "https://graph.microsoft.com/",
		},
		{
			name: "microsoft-onenote",
			imageUrl: "https://asset.brandfetch.io/idrfH1ij9n/idUEYlOACF.jpeg",
			scopes: [
				"Notes.Create",
				"Notes.Read",
				"Notes.Read.All",
				"Notes.ReadWrite",
				"Notes.ReadWrite.All",
				"Notes.ReadWrite.CreatedByApp",
			],
			prefix: "https://onenote.com/",
		},
		{
			name: "microsoft-outlook",
			imageUrl: "https://asset.brandfetch.io/idosUKQbqO/idMid1peP1.svg",
			scopes: [
				"Calendars.Read",
				"Calendars.Read.All",
				"Calendars.Read.Shared",
				"Calendars.ReadWrite",
				"Calendars.ReadWrite.All",
				"Calendars.ReadWrite.Shared",
				"Contacts.Read",
				"Contacts.Read.All",
				"Contacts.Read.Shared",
				"Contacts.ReadWrite",
				"Contacts.ReadWrite.All",
				"Contacts.ReadWrite.Shared",
				"Mail.Read",
				"Mail.Read.All",
				"Mail.Read.Shared",
				"Mail.ReadBasic",
				"Mail.ReadWrite",
				"Mail.ReadWrite.All",
				"Mail.ReadWrite.Shared",
				"Mail.Send",
				"Mail.Send.All",
				"Mail.Send.Shared",
				"Tasks.Read",
				"Tasks.Read.Shared",
				"Tasks.ReadWrite",
				"Tasks.ReadWrite.Shared",
				"User.Read",
				"User.ReadBasic.All",
				"User.ReadWrite",
			],
			prefix: "https://outlook.office.com/",
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "service"
       WHERE "id" = 'microsoft'`,
		);
		await queryRunner.query(
			`DELETE
       FROM "service_scope"
       WHERE "service_id" = 'microsoft'`,
		);
		await Promise.all(
			this.MICROSOFT_SUBSERVICES.map(async ({ name, imageUrl, scopes, prefix }) => {
				await queryRunner.query(
					`INSERT INTO "service" ("id", "image_url", "oauth_url")
           VALUES ('${name}',
                   '${imageUrl}',
                   'https://login.microsoftonline.com/common/oauth2/v2.0/authorize')`,
				);
				await queryRunner.query(
					`INSERT INTO "service_scope" ("id", "service_id")
          VALUES
          ${[...scopes.map((scope) => `${prefix}${scope}`), ...["profile", "openid", "email"]]
						.map((scope) => `('${scope}', '${name}')`)
						.join(", ")}`,
				);
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "service" ("id", "image_url", "oauth_url")
       VALUES ('microsoft',
               'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png?20210729021049',
               'https://login.microsoftonline.com/common/oauth2/v2.0/authorize')`,
		);
		await queryRunner.query(
			`INSERT INTO "service_scope" ("id", "service_id")
      VALUES
      ${this.OLD_MICROSOFT_SERVICE_SCOPES.map((scope) => `('${scope}', 'microsoft')`).join(", ")}`,
		);
		await Promise.all(
			this.MICROSOFT_SUBSERVICES.map(async ({ name, scopes, prefix }) => {
				await queryRunner.query(
					`DELETE
           FROM "service"
           WHERE "id" = '${name}'`,
				);
				await queryRunner.query(
					`DELETE
           FROM "service_scope"
           WHERE "service_id" = '${name}'
             AND "id" IN (${scopes.map((scope) => `'${prefix}${scope}'`).join(",")})`,
				);
			}),
		);
	}
}
