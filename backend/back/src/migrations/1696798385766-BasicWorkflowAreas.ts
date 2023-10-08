import { MigrationInterface, QueryRunner } from "typeorm";

export class BasicWorkflowAreas1696798385766 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
          INSERT INTO service (id, image_url, oauth_url) VALUES
            ('google', 'https://companieslogo.com/img/orig/GOOG-0ed88f7c.png?t=1633218227', 'https://accounts.google.com/o/oauth2/auth'),
            ('timer', 'https://cdn-icons-png.flaticon.com/512/1571/1571810.png', '');
        `);

		await queryRunner.query(`
            INSERT INTO service_scope (id, service_id) VALUES
               ('https://www.googleapis.com/auth/gmail.send', 'google');
        `);

		await queryRunner.query(`
          INSERT INTO area (id, service_id, is_action) VALUES
            ('seconds-interval', 'timer', true),
            ('send-email', 'google', false);
        `);

		await queryRunner.query(`
          INSERT INTO area_service_scopes_needed_service_scope (area_id, area_service_id, service_scope_id, service_scope_service_id) VALUES
            ('send-email', 'google', 'https://www.googleapis.com/auth/gmail.send', 'google');
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
          DELETE FROM service WHERE id IN ('google', 'timer');
        `);

		await queryRunner.query(`
          DELETE FROM service_scope WHERE id = 'google' AND service_id = 'https://www.googleapis.com/auth/gmail.send';
        `);

		await queryRunner.query(`
          DELETE FROM area WHERE id IN ('seconds-interval', 'send-email');
        `);
	}
}
