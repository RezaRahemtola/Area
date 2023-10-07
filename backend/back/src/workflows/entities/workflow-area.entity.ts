import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import Workflow from "./workflow.entity";
import Area from "../../services/entities/area.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export default class WorkflowArea {
	@ApiProperty()
	@PrimaryColumn({ type: "uuid" })
	id!: string;

	@ManyToOne(() => Workflow, (workflow) => workflow.reactions, { nullable: true, onDelete: "CASCADE" })
	@JoinColumn()
	workflow!: Workflow;

	@OneToOne(() => Workflow, (workflow) => workflow.action, { nullable: true, onDelete: "CASCADE" })
	@JoinColumn()
	actionOfWorkflow!: Workflow;

	@ManyToOne(() => WorkflowArea, { nullable: true, onDelete: "CASCADE" })
	previousArea!: WorkflowArea;
	@OneToMany(() => WorkflowArea, (reactions) => reactions.previousArea, { nullable: true, onDelete: "CASCADE" })
	nextReactions!: WorkflowArea[];

	@ApiProperty({
		type: () => Area,
	})
	@ManyToOne(() => Area, { nullable: false })
	area!: Area;

	@ApiProperty()
	@Column({ type: "jsonb" })
	// eslint-disable-next-line
	parameters!: Record<string, any>;
}
