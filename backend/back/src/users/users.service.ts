import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { AdminUpdateUserDto } from "./dto/update-user.dto";
import UserSettings from "./entities/user-settings.entity";

type UserIdentification = { id: string } | { email: string };

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	createUser(email: string, passwordHash: string, isAdmin: boolean = false): Promise<boolean> {
		return this.userRepository
			.save({ email, passwordHash, isAdmin, settings: { language: "en", theme: "auto" } })
			.then(() => true)
			.catch(() => false);
	}

	async getUser(options: UserIdentification) {
		const user = await this.userRepository.findOne({ where: options, relations: { settings: true } });
		const identifier = "id" in options ? options.id : options.email;
		if (!user) throw new NotFoundException(`User ${identifier} not found.`);
		return user;
	}

	async updateUser(options: UserIdentification, { theme, language, ...update }: AdminUpdateUserDto): Promise<boolean> {
		const user = await this.userRepository.findOne({ where: options });
		if (!user) throw new NotFoundException(`User ${"id" in options ? options.id : options.email} not found.`);
		if (Object.keys(update).length == 0 && !theme && !language) return false;
		let result = false;
		let exception: unknown = null;
		const queryRunner = this.userRepository.manager.connection.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			if (update.email && (await queryRunner.manager.exists(User, { where: { email: update.email } })))
				throw new ConflictException(`User ${update.email} already exists.`);
			if (Object.keys(update).length > 0)
				result ||= (await queryRunner.manager.update(User, { id: user.id }, { ...update })).affected > 0;

			if (theme || language) {
				result ||=
					(
						await queryRunner.manager.update(
							UserSettings,
							{ userId: user.id },
							{
								theme,
								language,
							},
						)
					).affected > 0;
			}

			return result;
		} catch (_exception) {
			await queryRunner.rollbackTransaction();
			exception = _exception;
		} finally {
			await queryRunner.release();
			if (exception) throw exception;
		}
	}

	async deleteUser(options: UserIdentification): Promise<boolean> {
		try {
			if (!(await this.userRepository.exist({ where: options }))) return false;
			return (await this.userRepository.delete(options)).affected > 0;
		} catch {
			return false;
		}
	}
}
