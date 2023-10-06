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
import WorkflowArea from "./workflow-area.entity";

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

	@OneToMany(() => WorkflowArea, (reaction) => reaction.workflow, { cascade: true, nullable: true })
	reactions!: WorkflowArea[];

	@OneToOne(() => WorkflowArea, (action) => action.actionOfWorkflow, {
		cascade: true,
		nullable: true,
		onDelete: "SET NULL",
	})
	@JoinColumn()
	action!: WorkflowArea;

	@CreateDateColumn()
	createdAt!: Date;
}
