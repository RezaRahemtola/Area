import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateRiotGamesActions1698964479850 implements MigrationInterface {
	private readonly riotActionParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "region",
			type: "select",
			required: true,
			values: ["br", "eun", "euw", "jp", "kr", "la", "la2", "na", "oc", "tr", "ru"],
		},
		{
			name: "summoner",
			type: "short-text",
			required: true,
		},
	];

	private readonly riotLevelActionParametersReturnFlow: string[] = ["level"];

	private readonly riotGameActionsParametersReturnFlow: string[] = [
		...this.riotLevelActionParametersReturnFlow,
		"assists",
		"champion",
		"deaths",
		"kills",
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('lol-on-game-end', 'riot', true, 'Triggers when a player ends a LoL match', $1, '{${this.riotGameActionsParametersReturnFlow
							.map((v) => `"${v}"`)
							.join(",")}}'),
                   ('lol-on-game-loss', 'riot', true, 'Triggers when a player lost a LoL match', $1, '{${this.riotGameActionsParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}'),
                   ('lol-on-game-win', 'riot', true, 'Triggers when a player won a LoL match', $1, '{${this.riotGameActionsParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}'),
                   ('lol-on-level-up', 'riot', true, 'Triggers when a LoL summoner levels up', $1, '{${this.riotLevelActionParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}')`,
			[JSON.stringify(this.riotActionParametersFormFlow)],
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area"
             WHERE service_id = 'riot'
				AND id IN ('lol-on-game-end', 'lol-on-game-loss', 'lol-on-game-win', 'lol-on-level-up');
             `,
		);
	}
}
