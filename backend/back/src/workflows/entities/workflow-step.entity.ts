import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import Workflow from "./workflow.entity";
import Area from "../../services/entities/area.entity";

@Entity()
export default class WorkflowStep {
	@PrimaryColumn({ type: "uuid" })
	id!: string;

	@Column()
	workflowId!: string;
	@OneToOne(() => Workflow, { nullable: false, onDelete: "CASCADE" })
	workflow!: Workflow;

	@ManyToOne(() => WorkflowStep, { nullable: true, onDelete: "CASCADE" })
	previousStep!: WorkflowStep;
	@OneToMany(() => WorkflowStep, (step) => step.previousStep, { nullable: false, onDelete: "CASCADE" })
	nextSteps!: WorkflowStep[];

	@ManyToOne(() => Area, { nullable: false })
	area!: Area;
	@Column({ type: "jsonb" })
	// eslint-disable-next-line
	parameters!: Record<string, any>;
}
