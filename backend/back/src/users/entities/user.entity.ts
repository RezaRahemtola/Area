import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ unique: true })
	email!: string;

	@Column()
	passwordHash!: string;

	@Column({ nullable: true })
	totpSecret?: string;

	// TODO: Add plan
	// @ManyToOne(() => Plan)
	// plan!: Plan;

	@Column()
	isAdmin!: boolean;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;
}
