import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import UserSettings from "./user-settings.entity";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ unique: true })
	email!: string;

	@Column({ nullable: true })
	passwordHash!: string;

	@Column({ nullable: true })
	totpSecret?: string;

	@OneToOne(() => UserSettings, (settings) => settings.user, { cascade: true, nullable: false })
	settings!: UserSettings;

	// TODO: Add plan
	// @ManyToOne(() => Plan)
	// plan!: Plan;

	@Column()
	isAdmin!: boolean;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt!: Date;
}
