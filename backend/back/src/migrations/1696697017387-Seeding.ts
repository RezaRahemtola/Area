import { MigrationInterface, QueryRunner } from "typeorm";

export class Seeding1696697017387 implements MigrationInterface {
	name = "Seeding1696697017387";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
        CREATE TABLE "user"
        (
            "id"            uuid                     NOT NULL DEFAULT uuid_generate_v4(),
            "email"         character varying        NOT NULL,
            "password_hash" character varying        NOT NULL,
            "totp_secret"   character varying,
            "is_admin"      boolean                  NOT NULL,
            "created_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        )
    `);
		await queryRunner.query(`
        CREATE TABLE "service_scope"
        (
            "id"         character varying NOT NULL,
            "service_id" character varying NOT NULL,
            CONSTRAINT "PK_89826e359ee0de5d6a11c4a8b9a" PRIMARY KEY ("id", "service_id")
        )
    `);
		await queryRunner.query(`
        CREATE TABLE "service"
        (
            "id"        character varying NOT NULL,
            "image_url" character varying NOT NULL,
            "oauth_url" character varying NOT NULL,
            CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id")
        )
    `);
		await queryRunner.query(`
        CREATE TABLE "user_connection"
        (
            "user_id"    uuid              NOT NULL,
            "service_id" character varying NOT NULL,
            "token"      character varying NOT NULL,
            "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
            CONSTRAINT "PK_a203f603a1456b2d5182423ab95" PRIMARY KEY ("user_id", "service_id")
        )
    `);
		await queryRunner.query(`
        CREATE TABLE "area"
        (
            "id"         character varying NOT NULL,
            "service_id" character varying NOT NULL,
            "is_action"  boolean           NOT NULL,
            CONSTRAINT "PK_e0951fd352ac08691c091b14e46" PRIMARY KEY ("id", "service_id")
        )
    `);
		await queryRunner.query(`
        CREATE TABLE "workflow_area"
        (
            "id"                        uuid              NOT NULL,
            "parameters"                jsonb             NOT NULL,
            "workflow_id"               uuid,
            "action_of_workflow_id"     uuid,
            "previous_workflow_area_id" uuid,
            "area_id"                   character varying NOT NULL,
            "area_service_id"           character varying NOT NULL,
            CONSTRAINT "REL_4697d8072cd4c86663eca44faf" UNIQUE ("action_of_workflow_id"),
            CONSTRAINT "PK_8ed04103c4ee18bd72911c9c47e" PRIMARY KEY ("id")
        )
    `);
		await queryRunner.query(`
        CREATE TABLE "workflow"
        (
            "id"         uuid              NOT NULL DEFAULT uuid_generate_v4(),
            "name"       character varying NOT NULL,
            "owner_id"   uuid              NOT NULL,
            "active"     boolean           NOT NULL,
            "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
            "action_id"  uuid,
            CONSTRAINT "UQ_62868d449eafddab9330e1c767f" UNIQUE ("name", "owner_id"),
            CONSTRAINT "REL_8b55a01cdedba3cf83dc7038a7" UNIQUE ("action_id"),
            CONSTRAINT "PK_eb5e4cc1a9ef2e94805b676751b" PRIMARY KEY ("id")
        )
    `);
		await queryRunner.query(`
        CREATE TABLE "user_connection_scopes_service_scope"
        (
            "user_connection_user_id"    uuid              NOT NULL,
            "user_connection_service_id" character varying NOT NULL,
            "service_scope_id"           character varying NOT NULL,
            "service_scope_service_id"   character varying NOT NULL,
            CONSTRAINT "PK_e91c2b8c1db53d9fc6bfb920ff8" PRIMARY KEY (
                                                                     "user_connection_user_id",
                                                                     "user_connection_service_id",
                                                                     "service_scope_id",
                                                                     "service_scope_service_id"
                )
        )
    `);
		await queryRunner.query(`
        CREATE INDEX "IDX_82e27573f71ac477a7291ef9ad" ON "user_connection_scopes_service_scope" (
                                                                                                 "user_connection_user_id",
                                                                                                 "user_connection_service_id"
            )
    `);
		await queryRunner.query(`
        CREATE INDEX "IDX_10093361cb2ab2681310503b1d" ON "user_connection_scopes_service_scope" ("service_scope_id", "service_scope_service_id")
    `);
		await queryRunner.query(`
        CREATE TABLE "area_service_scopes_needed_service_scope"
        (
            "area_id"                  character varying NOT NULL,
            "area_service_id"          character varying NOT NULL,
            "service_scope_id"         character varying NOT NULL,
            "service_scope_service_id" character varying NOT NULL,
            CONSTRAINT "PK_7ff14a41ff475270658028d7fc2" PRIMARY KEY (
                                                                     "area_id",
                                                                     "area_service_id",
                                                                     "service_scope_id",
                                                                     "service_scope_service_id"
                )
        )
    `);
		await queryRunner.query(`
        CREATE INDEX "IDX_b4dcd444a7d6c283430e9b312f" ON "area_service_scopes_needed_service_scope" ("area_id", "area_service_id")
    `);
		await queryRunner.query(`
        CREATE INDEX "IDX_919ac3ee77f37b6c6d3d24fa91" ON "area_service_scopes_needed_service_scope" ("service_scope_id", "service_scope_service_id")
    `);
		await queryRunner.query(`
        ALTER TABLE "service_scope"
            ADD CONSTRAINT "FK_f24c8213d2d4abac27fb5a98496" FOREIGN KEY ("service_id") REFERENCES "service" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
		await queryRunner.query(`
        ALTER TABLE "user_connection"
            ADD CONSTRAINT "FK_77204fdb5a08df41e05ed1c3cb0" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
		await queryRunner.query(`
        ALTER TABLE "user_connection"
            ADD CONSTRAINT "FK_dc5417b2fd61160b59bd8b3f397" FOREIGN KEY ("service_id") REFERENCES "service" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
		await queryRunner.query(`
        ALTER TABLE "area"
            ADD CONSTRAINT "FK_f1e7b7ab424cada19b1a951cfb1" FOREIGN KEY ("service_id") REFERENCES "service" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow_area"
            ADD CONSTRAINT "FK_0e954107b28f47388ae236844ad" FOREIGN KEY ("workflow_id") REFERENCES "workflow" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow_area"
            ADD CONSTRAINT "FK_4697d8072cd4c86663eca44fafc" FOREIGN KEY ("action_of_workflow_id") REFERENCES "workflow" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow_area"
            ADD CONSTRAINT "FK_c405c8144b014bbdcac1814f422" FOREIGN KEY ("previous_workflow_area_id") REFERENCES "workflow_area" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow_area"
            ADD CONSTRAINT "FK_b83fa7a12439e1b7b4c4a4f72b8" FOREIGN KEY ("area_id", "area_service_id") REFERENCES "area" ("id", "service_id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow"
            ADD CONSTRAINT "FK_a78d2d1012249ca1deaa090b5b9" FOREIGN KEY ("owner_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow"
            ADD CONSTRAINT "FK_8b55a01cdedba3cf83dc7038a7b" FOREIGN KEY ("action_id") REFERENCES "workflow_area" ("id") ON DELETE
                SET NULL ON UPDATE NO ACTION
    `);
		await queryRunner.query(`
        ALTER TABLE "user_connection_scopes_service_scope"
            ADD CONSTRAINT "FK_82e27573f71ac477a7291ef9ad1" FOREIGN KEY (
                                                                         "user_connection_user_id",
                                                                         "user_connection_service_id"
                ) REFERENCES "user_connection" ("user_id", "service_id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
		await queryRunner.query(`
        ALTER TABLE "user_connection_scopes_service_scope"
            ADD CONSTRAINT "FK_10093361cb2ab2681310503b1dc" FOREIGN KEY ("service_scope_id", "service_scope_service_id") REFERENCES "service_scope" ("id", "service_id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
		await queryRunner.query(`
        ALTER TABLE "area_service_scopes_needed_service_scope"
            ADD CONSTRAINT "FK_b4dcd444a7d6c283430e9b312f2" FOREIGN KEY ("area_id", "area_service_id") REFERENCES "area" ("id", "service_id") ON DELETE
                SET NULL ON UPDATE CASCADE
    `);
		await queryRunner.query(`
        ALTER TABLE "area_service_scopes_needed_service_scope"
            ADD CONSTRAINT "FK_919ac3ee77f37b6c6d3d24fa916" FOREIGN KEY ("service_scope_id", "service_scope_service_id") REFERENCES "service_scope" ("id", "service_id") ON DELETE CASCADE ON UPDATE CASCADE
    `);

		await queryRunner.query(`ALTER TABLE "service"
        ADD "need_connection" boolean NOT NULL DEFAULT true`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
        ALTER TABLE "area_service_scopes_needed_service_scope"
            DROP CONSTRAINT "FK_919ac3ee77f37b6c6d3d24fa916"
    `);
		await queryRunner.query(`
        ALTER TABLE "area_service_scopes_needed_service_scope"
            DROP CONSTRAINT "FK_b4dcd444a7d6c283430e9b312f2"
    `);
		await queryRunner.query(`
        ALTER TABLE "user_connection_scopes_service_scope"
            DROP CONSTRAINT "FK_10093361cb2ab2681310503b1dc"
    `);
		await queryRunner.query(`
        ALTER TABLE "user_connection_scopes_service_scope"
            DROP CONSTRAINT "FK_82e27573f71ac477a7291ef9ad1"
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow"
            DROP CONSTRAINT "FK_8b55a01cdedba3cf83dc7038a7b"
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow"
            DROP CONSTRAINT "FK_a78d2d1012249ca1deaa090b5b9"
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow_area"
            DROP CONSTRAINT "FK_b83fa7a12439e1b7b4c4a4f72b8"
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow_area"
            DROP CONSTRAINT "FK_c405c8144b014bbdcac1814f422"
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow_area"
            DROP CONSTRAINT "FK_4697d8072cd4c86663eca44fafc"
    `);
		await queryRunner.query(`
        ALTER TABLE "workflow_area"
            DROP CONSTRAINT "FK_0e954107b28f47388ae236844ad"
    `);
		await queryRunner.query(`
        ALTER TABLE "area"
            DROP CONSTRAINT "FK_f1e7b7ab424cada19b1a951cfb1"
    `);
		await queryRunner.query(`
        ALTER TABLE "user_connection"
            DROP CONSTRAINT "FK_dc5417b2fd61160b59bd8b3f397"
    `);
		await queryRunner.query(`
        ALTER TABLE "user_connection"
            DROP CONSTRAINT "FK_77204fdb5a08df41e05ed1c3cb0"
    `);
		await queryRunner.query(`
        ALTER TABLE "service_scope"
            DROP CONSTRAINT "FK_f24c8213d2d4abac27fb5a98496"
    `);
		await queryRunner.query(`
        DROP INDEX "public"."IDX_919ac3ee77f37b6c6d3d24fa91"
    `);
		await queryRunner.query(`
        DROP INDEX "public"."IDX_b4dcd444a7d6c283430e9b312f"
    `);
		await queryRunner.query(`
        DROP TABLE "area_service_scopes_needed_service_scope"
    `);
		await queryRunner.query(`
        DROP INDEX "public"."IDX_10093361cb2ab2681310503b1d"
    `);
		await queryRunner.query(`
        DROP INDEX "public"."IDX_82e27573f71ac477a7291ef9ad"
    `);
		await queryRunner.query(`
        DROP TABLE "user_connection_scopes_service_scope"
    `);
		await queryRunner.query(`
        DROP TABLE "workflow"
    `);
		await queryRunner.query(`
        DROP TABLE "workflow_area"
    `);
		await queryRunner.query(`
        DROP TABLE "area"
    `);
		await queryRunner.query(`
        DROP TABLE "user_connection"
    `);
		await queryRunner.query(`
        DROP TABLE "service"
    `);
		await queryRunner.query(`
        DROP TABLE "service_scope"
    `);
		await queryRunner.query(`
        DROP TABLE "user"
    `);
	}
}
