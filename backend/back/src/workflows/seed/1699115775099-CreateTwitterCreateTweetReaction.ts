import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateTwitterCreateTweetReaction1699115775099 implements MigrationInterface {
	private readonly twitterCreateTweetParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "text",
			type: "long-text",
			required: true,
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('create-tweet', 'twitter', false, 'Post a tweet on Twitter (X)', $1, '{}')`,
			[JSON.stringify(this.twitterCreateTweetParametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('create-tweet', 'twitter', 'tweet.read', 'twitter'),
                   ('create-tweet', 'twitter', 'tweet.write', 'twitter'),
                   ('create-tweet', 'twitter', 'users.read', 'twitter')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area"
             WHERE service_id = 'twitter'
				AND id IN ('create-tweet');
             `,
		);
	}
}
