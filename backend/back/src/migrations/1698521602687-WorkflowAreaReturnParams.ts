import { MigrationInterface, QueryRunner } from "typeorm";

type AreaParametersReturnFlow = {
	areas: string[];
	parameters: string[];
};

export class WorkflowAreaReturnParams1698521602687 implements MigrationInterface {
	private readonly areaParametersReturnFlow: AreaParametersReturnFlow[] = [
		{
			areas: ["close-issue", "create-issue", "reopen-issue"],
			parameters: ["url"],
		},
		{
			areas: ["on-issue-close", "on-issue-create", "on-issue-reopen"],
			parameters: ["author", "body", "createdAt", "title", "url"],
		},
		{
			areas: ["on-pull-request-close", "on-pull-request-create", "on-pull-request-merge"],
			parameters: ["author", "base", "body", "createdAt", "compare", "title", "url"],
		},
		{
			areas: ["on-commit"],
			parameters: ["author", "branch", "createdAt", "message", "url"],
		},
		{
			areas: ["on-new-video"],
			parameters: ["createdAt", "description", "title", "url"],
		},
		{
			areas: ["seconds-interval"],
			parameters: ["seconds"],
		},
	];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            alter table area
                add column parameters_return_flow text[] not null default array[]::text[];
        `);

		for (const params of this.areaParametersReturnFlow) {
			await queryRunner.query(`
                update area
                set parameters_return_flow = '{${params.parameters.map((v) => `"${v}"`).join(",")}}'
                where id in (${params.areas.map((v) => `'${v}'`).join(",")})
            `);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            alter table area
                drop column parameters_return_flow;
        `);
	}
}
