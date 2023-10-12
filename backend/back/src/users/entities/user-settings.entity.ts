import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Language, LANGUAGES, Theme, THEMES } from "../../types/user-settings";

@Entity()
export default class UserSettings {
	@PrimaryColumn("uuid")
	userId!: string;
	@OneToOne(() => User, (user) => user.settings, { onDelete: "CASCADE", nullable: false })
	@JoinColumn({ name: "user_id" })
	user!: User;

	@Column({ enum: LANGUAGES, default: "en" })
	language!: Language;

	@Column({ enum: THEMES, default: "auto" })
	theme!: Theme;
}
