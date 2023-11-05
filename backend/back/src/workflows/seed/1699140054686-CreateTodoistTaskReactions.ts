import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateTodoistTaskReactions1699140054686 implements MigrationInterface {
	private readonly todoistIdParametersFormFlow: ParametersFormFlowFieldDto[] = [
		{
			name: "id",
			type: "short-text",
			required: true,
		},
	];

	private readonly todoistUpdateTaskParametersFormFlow: ParametersFormFlowFieldDto[] = [
		...this.todoistIdParametersFormFlow,
		{
			name: "content",
			type: "short-text",
			required: true,
		},
		{
			name: "description",
			type: "short-text",
			required: false,
		},
		{
			name: "priority",
			type: "integer",
			required: false,
		},
		{
			name: "dueDate",
			type: "short-text",
			required: false,
		},
	];

	private readonly todoistUpdateTaskParametersReturnFlow: string[] = ["url"];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('update-task', 'todoist', false, 'Update a task on Todoist', $1, '{${this.todoistUpdateTaskParametersReturnFlow
							.map((v) => `"${v}"`)
							.join(",")}}'),
                   ('close-task', 'todoist', false, 'Close a task on Todoist', $2, '{}'),
                   ('delete-task', 'todoist', false, 'Delete a task on Todoist', $2, '{}'),
                   ('reopen-task', 'todoist', false, 'Reopen a task on Todoist', $2, '{}')
                   `,
			[
				JSON.stringify(this.todoistUpdateTaskParametersFormFlow),
				JSON.stringify(this.todoistIdParametersFormFlow),
			],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('update-task', 'todoist', 'data:read_write', 'todoist'),
                   ('close-task', 'todoist', 'data:read_write', 'todoist'),
                   ('delete-task', 'todoist', 'data:delete', 'todoist'),
                   ('reopen-task', 'todoist', 'data:read_write', 'todoist')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area"
             WHERE service_id = 'todoist'
				AND id IN ('update-task', 'close-task', 'delete-task', 'reopen-task')
             `,
		);
	}
}
