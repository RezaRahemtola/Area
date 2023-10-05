import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import Workflow from "./workflow.entity";
import Area from "../../services/entities/area.entity";

@Entity()
export default class WorkflowStep {
	@PrimaryColumn({ type: "uuid" })
	id!: string;

	@ManyToOne(() => Workflow, (workflow) => workflow.reactions, { nullable: false, onDelete: "CASCADE" })
	@JoinColumn()
	workflow!: Workflow;

	@OneToOne(() => Workflow, (workflow) => workflow.action, { nullable: true, onDelete: "CASCADE" })
	entryOfWorkflow!: Workflow;

	@ManyToOne(() => WorkflowStep, { nullable: true, onDelete: "CASCADE" })
	previousStep!: WorkflowStep;
	@OneToMany(() => WorkflowStep, (step) => step.previousStep, { nullable: true, onDelete: "CASCADE" })
	nextSteps!: WorkflowStep[];

	@ManyToOne(() => Area, { nullable: false })
	area!: Area;

	@Column({ type: "jsonb" })
	// eslint-disable-next-line
	parameters!: Record<string, any>;
}
