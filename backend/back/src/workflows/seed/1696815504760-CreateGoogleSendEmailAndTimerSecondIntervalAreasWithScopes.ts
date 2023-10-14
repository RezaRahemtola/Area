import { In, MigrationInterface, QueryRunner } from "typeorm";
import Area from "../../services/entities/area.entity";

export class CreateGoogleSendEmailAndTimerSecondIntervalAreasWithScopes1696815504760 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action")
       VALUES ('send-email', 'google', false),
              ('seconds-interval', 'timer', true)`,
		);
		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope"
       ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
       VALUES ('send-email', 'google', 'https://www.googleapis.com/auth/gmail.send', 'google')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Area).delete({
			id: In(["send-email", "seconds-interval"]),
			serviceId: In(["google", "timer"]),
		});
		await queryRunner.query(
			`DELETE
       FROM "area"
       WHERE "id" IN ('send-email', 'seconds-interval')
         AND "service_id" IN ('google', 'timer')`,
		);
	}
}
