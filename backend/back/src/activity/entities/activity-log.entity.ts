import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import Workflow from "../../workflows/entities/workflow.entity";
import WorkflowArea from "../../workflows/entities/workflow-area.entity";

export const ACTIVITY_LOG_TYPES = ["ran", "error"] as const;
export type ActivityLogType = (typeof ACTIVITY_LOG_TYPES)[number];

@Entity()
export default class ActivityLog {
	@ApiProperty({
		description: "The id of the activity log",
	})
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@ApiProperty({
		description: "The type of the activity log, ran or error",
	})
	@Column({ enum: ACTIVITY_LOG_TYPES })
	type!: ActivityLogType;

	@ApiProperty({
		description: "The id of the workflow",
	})
	@Column()
	workflowId!: string;
	@ManyToOne(() => Workflow, { onDelete: "CASCADE" })
	@JoinColumn({ name: "workflow_id" })
	workflow!: Workflow;

	@ApiProperty({
		description: "The id of the workflow area",
	})
	@ManyToOne(() => WorkflowArea, { onDelete: "CASCADE" })
	workflowArea!: WorkflowArea;

	@ApiProperty({
		description: "The date the activity log was created",
	})
	@CreateDateColumn({ type: "timestamp" })
	createdAt!: Date;
}
