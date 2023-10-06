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
import { ApiProperty } from "@nestjs/swagger";

@Entity()
@Unique(["name", "ownerId"])
export default class Workflow {
	@ApiProperty()
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@ApiProperty()
	@Column()
	name!: string;

	@Column()
	ownerId!: string;
	@ApiProperty({
		type: () => User,
	})
	@ManyToOne(() => User, { nullable: false })
	@JoinColumn({ name: "owner_id" })
	owner!: User;

	@ApiProperty()
	@Column()
	active!: boolean;

	@ApiProperty({
		example: {
			id: "string",
			parameters: {},
		},
	})
	@OneToMany(() => WorkflowArea, (reaction) => reaction.workflow, { cascade: true, nullable: true })
	reactions!: WorkflowArea[];

	@ApiProperty({
		example: {
			id: "string",
			parameters: {},
		},
	})
	@OneToOne(() => WorkflowArea, (action) => action.actionOfWorkflow, {
		cascade: true,
		nullable: true,
		onDelete: "SET NULL",
	})
	@JoinColumn()
	action!: WorkflowArea;

	@ApiProperty()
	@CreateDateColumn()
	createdAt!: Date;
}
