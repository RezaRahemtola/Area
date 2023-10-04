import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryColumn, Unique } from "typeorm";
import { User } from "../../users/entities/user.entity";
import WorkflowStep from "./workflow-step.entity";

@Entity()
@Unique(["name", "ownerId"])
export default class Workflow {
	@PrimaryColumn("uuid")
	id!: string;

	@Column()
	name!: string;

	@Column()
	ownerId!: string;
	@ManyToOne(() => User)
	owner!: User;

	@Column()
	active!: boolean;

	@OneToOne(() => WorkflowStep)
	entry!: WorkflowStep;

	@CreateDateColumn()
	createdAt!: Date;
}
