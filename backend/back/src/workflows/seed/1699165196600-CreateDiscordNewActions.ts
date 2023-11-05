import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateDiscordNewActions1699165196600 implements MigrationInterface {
	private readonly DISCORD_ACTIONS: Array<{
		name: string;
		neededScope: string;
		description: string;
		parametersFormFlow: ParametersFormFlowFieldDto[];
		parametersReturnFlow: string[];
	}> = [
		{
			name: "on-avatar-change",
			neededScope: "identify",
			description: "Fired when the global avatar of the user changes",
			parametersFormFlow: [],
			parametersReturnFlow: ["newAvatarHash"],
		},
		{
			name: "on-guild-avatar-change",
			neededScope: "guilds.members.read",
			description: "Fired when the guild avatar of the user changes",
			parametersFormFlow: [
				{
					name: "guildId",
					type: "short-text",
					required: true,
				},
			],
			parametersReturnFlow: ["newAvatarHash"],
		},
		{
			name: "on-guild-boost",
			neededScope: "guilds.members.read",
			description: "Fired when the user boosts a guild",
			parametersFormFlow: [
				{
					name: "guildId",
					type: "short-text",
					required: true,
				},
			],
			parametersReturnFlow: [],
		},
		{
			name: "on-guild-deafen",
			neededScope: "guilds.members.read",
			description: "Fired when the user is deafened on a guild",
			parametersFormFlow: [
				{
					name: "guildId",
					type: "short-text",
					required: true,
				},
			],
			parametersReturnFlow: [],
		},
		{
			name: "on-guild-leave",
			neededScope: "guilds",
			description: "Fired when the user leaves a guild",
			parametersFormFlow: [
				{
					name: "guildId",
					type: "short-text",
					required: false,
				},
			],
			parametersReturnFlow: ["guildName"],
		},
		{
			name: "on-guild-mute",
			neededScope: "guilds.members.read",
			description: "Fired when the user is muted on a guild",
			parametersFormFlow: [
				{
					name: "guildId",
					type: "short-text",
					required: true,
				},
			],
			parametersReturnFlow: [],
		},
		{
			name: "on-guild-nickname-change",
			neededScope: "guilds.members.read",
			description: "Fired when the user''s nickname is changed on a guild",
			parametersFormFlow: [
				{
					name: "guildId",
					type: "short-text",
					required: true,
				},
			],
			parametersReturnFlow: ["newNickname"],
		},
		{
			name: "on-guild-roles-change",
			neededScope: "guilds.members.read",
			description: "Fired when the user''s roles are changed on a guild",
			parametersFormFlow: [
				{
					name: "guildId",
					type: "short-text",
					required: true,
				},
			],
			parametersReturnFlow: ["addedRoles", "removedRoles"],
		},
		{
			name: "on-guild-timeout",
			neededScope: "guilds.members.read",
			description: "Fired when the user is timed out on a guild",
			parametersFormFlow: [
				{
					name: "guildId",
					type: "short-text",
					required: true,
				},
			],
			parametersReturnFlow: ["timeoutEndsAt"],
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow",
                           "parameters_return_flow")
      VALUES
      ${this.DISCORD_ACTIONS.map(
				({ name, description, parametersFormFlow, parametersReturnFlow }) =>
					`('${name}', 'discord', true, '${description}', '${JSON.stringify(
						parametersFormFlow,
					)}', '{${parametersReturnFlow.map((param) => `"${param}"`).join(",")}}')`,
			).join(",")}`,
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id",
                                                               "service_scope_service_id")
      VALUES
      ${this.DISCORD_ACTIONS.map(({ name, neededScope }) => `('${name}', 'discord', '${neededScope}', 'discord')`).join(
				",",
			)}`,
		);

		await queryRunner.query(`UPDATE "area"
                             SET "parameters_return_flow" = '{"guildName"}'
                             WHERE "service_id" = 'discord'
                               AND "id" = 'on-guild-join'`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE service_id = 'discord'
         AND id IN (${this.DISCORD_ACTIONS.map(({ name }) => `'${name}'`).join(",")});
			`,
		);

		await queryRunner.query(`UPDATE "area"
                             SET "parameters_return_flow" = '{}'
                             WHERE "service_id" = 'discord'
                               AND "id" = 'on-guild-join'`);
	}
}
