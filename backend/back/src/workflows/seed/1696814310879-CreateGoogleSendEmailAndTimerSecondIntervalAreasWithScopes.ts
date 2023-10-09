import { In, MigrationInterface, QueryRunner } from "typeorm";
import Area from "../../services/entities/area.entity";

export class CreateGoogleSendEmailAndTimerSecondIntervalAreasWithScopes1696814310879 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).save([
			{
				id: "send-email",
				serviceId: "google",
				serviceScopesNeeded: [{ id: "https://www.googleapis.com/auth/gmail.send" }],
				isAction: false,
			},
			{
				id: "second-interval",
				serviceId: "timer",
				serviceScopesNeeded: [],
				isAction: true,
			},
		]);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: In(["send-email", "second-interval"]),
			serviceId: In(["google", "timer"]),
		});
	}
}
