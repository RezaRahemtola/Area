import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import WorkflowStep from "./workflow-step.entity";

@Entity()
@Unique(["name", "ownerId"])
export default class Workflow {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column()
	name!: string;

	@Column()
	ownerId!: string;
	@ManyToOne(() => User, { nullable: false })
	@JoinColumn({ name: "owner_id" })
	owner!: User;

	@Column()
	active!: boolean;

	@OneToMany(() => WorkflowStep, (step) => step.workflow, { cascade: true, nullable: true })
	steps!: WorkflowStep[];

	@OneToOne(() => WorkflowStep, (entry) => entry.entryOfWorkflow, { cascade: true, nullable: true })
	@JoinColumn()
	entry!: WorkflowStep;

	@CreateDateColumn()
	createdAt!: Date;
}
