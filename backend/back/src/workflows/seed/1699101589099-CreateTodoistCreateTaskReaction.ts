import { MigrationInterface, QueryRunner } from "typeorm";
import { ParametersFormFlowFieldDto } from "../../services/dto/area.dto";

export class CreateTodoistCreateTaskReaction1699101589099 implements MigrationInterface {
	private readonly todoistCreateTaskParametersFormFlow: ParametersFormFlowFieldDto[] = [
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

	private readonly todoistCreateTaskParametersReturnFlow: string[] = ["url"];

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "area" ("id", "service_id", "is_action", "description", "parameters_form_flow", "parameters_return_flow")
            VALUES ('todoist-create-task', 'todoist', false, 'Create a task on Todoist', $1, '{${this.todoistCreateTaskParametersReturnFlow
							.map((v) => `"${v}"`)
							.join(",")}}')`,
			[JSON.stringify(this.todoistCreateTaskParametersFormFlow)],
		);

		await queryRunner.query(
			`INSERT INTO "area_service_scopes_needed_service_scope" ("area_id", "area_service_id", "service_scope_id", "service_scope_service_id")
            VALUES ('create-task', 'todoist', 'task:add', 'todoist')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "area"
             WHERE service_id = 'todoist'
				AND id IN ('create-task');
             `,
		);
	}
}
