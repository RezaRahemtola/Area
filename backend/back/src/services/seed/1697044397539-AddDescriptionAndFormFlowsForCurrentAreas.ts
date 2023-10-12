import { MigrationInterface, QueryRunner } from "typeorm";
import Area from "../entities/area.entity";

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
		await queryRunner.manager.getRepository(Area).save(this.descriptionsAndFormFlows);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).update(
			this.descriptionsAndFormFlows.map(({ id }) => id),
			{
				description: "An area description",
				parametersFormFlow: [],
			},
		);
	}
}
