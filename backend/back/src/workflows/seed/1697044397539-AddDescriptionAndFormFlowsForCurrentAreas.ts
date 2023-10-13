import { MigrationInterface, QueryRunner } from "typeorm";
import Area from "../../services/entities/area.entity";

export class AddDescriptionAndFormFlowsForCurrentAreas1697044397539 implements MigrationInterface {
	private readonly descriptionsAndFormFlows: Array<Partial<Area>> = [
		{
			id: "send-email",
			serviceId: "google",
			description: "Send an email with Google GMAIL",
			parametersFormFlow: [
				{
					name: "to",
					type: "email",
					required: true,
				},
				{
					name: "subject",
					type: "short-text",
					required: true,
				},
				{
					name: "body",
					type: "long-text",
					required: true,
				},
			],
		},
		{
			id: "seconds-interval",
			serviceId: "timer",
			description: "Trigger every X seconds",
			parametersFormFlow: [
				{
					name: "seconds",
					type: "integer",
					required: true,
				},
			],
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		for (const { id, serviceId, description, parametersFormFlow } of this.descriptionsAndFormFlows) {
			await queryRunner.query(
				`UPDATE "area"
         SET "parameters_form_flow" = $1,
             "description"          = $2
         WHERE "id" = $3
           AND "service_id" = $4`,
				[JSON.stringify(parametersFormFlow), description, id, serviceId],
			);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`UPDATE "area"
       SET "parameters_form_flow" = '[]',
           "description"          = 'An area description'
       WHERE "id" IN ('send-email', 'seconds-interval')
         AND "service_id" IN ('google', 'timer')`,
		);
	}
}
