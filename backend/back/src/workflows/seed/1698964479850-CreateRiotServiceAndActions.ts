import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateRiotServiceAndActions1698964479850 implements MigrationInterface {
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
			`INSERT INTO "service" ("id", "image_url", "oauth_url", "need_connection")
             VALUES ('riot',
                     'https://i.pinimg.com/originals/90/6d/23/906d231cbaff55c77fb97191592e1c76.png',
                     '',
                     false)`,
		);

		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('on-game-end', 'riot', true, 'Triggers when a player ends a LoL match', $1, '{${this.riotGameActionsParametersReturnFlow
							.map((v) => `"${v}"`)
							.join(",")}}'),
                   ('on-game-loss', 'riot', true, 'Triggers when a player lost a LoL match', $1, '{${this.riotGameActionsParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}'),
                   ('on-game-win', 'riot', true, 'Triggers when a player won a LoL match', $1, '{${this.riotGameActionsParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}'),
                   ('on-level-up', 'riot', true, 'Triggers when a LoL summoner levels up', $1, '{${this.riotLevelActionParametersReturnFlow
											.map((v) => `"${v}"`)
											.join(",")}}')`,
			[JSON.stringify(this.riotActionParametersFormFlow)],
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "service"
             WHERE id = 'riot'`,
		);
	}
}
