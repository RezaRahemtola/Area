import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { AdminUpdateUserDto } from "./dto/update-user.dto";
import UserSettings from "./entities/user-settings.entity";

type UserIdentification = { id: string } | { email: string };

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	createUser(email: string, passwordHash: string, isAdmin: boolean = false): Promise<boolean> {
		return this.userRepository
			.save({ email, passwordHash, isAdmin, settings: { language: "en", theme: "auto" } })
			.then(() => {
				this.logger.log(`Created ${isAdmin ? "admin " : " "}user with ${email}`);
				return true;
			})
			.catch(({ message }) => {
				this.logger.error(`Failed to create ${isAdmin ? "admin " : ""}user with ${email}: ${message}`);
				return false;
			});
	}

	async getUser(options: UserIdentification) {
		const user = await this.userRepository.findOne({ where: options, relations: { settings: true } });
		const identifier = "id" in options ? options.id : options.email;
		this.logger.log(`Getting user identified by ${identifier}`);
		if (!user) throw new NotFoundException(`User ${identifier} not found.`);
		return user;
	}

	async updateUser(options: UserIdentification, updateUserDto: AdminUpdateUserDto): Promise<boolean> {
		const user = await this.userRepository.findOne({ where: options });
		if (!user) throw new NotFoundException(`User ${"id" in options ? options.id : options.email} not found.`);
		if (Object.keys(updateUserDto).length == 0) {
			this.logger.log(`No changes to user ${user.id} requested.`);
			return false;
		}
		let result = false;
		const queryRunner = this.userRepository.manager.connection.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();
		this.logger.log(`Updating user ${user.id} with ${JSON.stringify(updateUserDto)}...`);

		const { theme, language, ...update } = updateUserDto;
		try {
			if (
				update.email &&
				update.email !== user.email &&
				(await queryRunner.manager.exists(User, { where: { email: update.email } }))
			) {
				// noinspection ExceptionCaughtLocallyJS
				throw new ConflictException(`User ${update.email} already exists.`);
			}
			if (Object.keys(update).length > 0) {
				this.logger.log(`Updating user ${user.id} with ${JSON.stringify(update)}...`);
				result ||= (await queryRunner.manager.update(User, { id: user.id }, { ...update })).affected > 0;
			}

			if (theme || language) {
				this.logger.log(`Updating user ${user.id} settings with ${JSON.stringify({ theme, language })}...`);
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

			await queryRunner.commitTransaction();
			return result;
		} catch (exception) {
			this.logger.error(`Failed to update user ${user.id}: ${exception.message}, rolling back...`);
			await queryRunner.rollbackTransaction();
			throw exception;
		} finally {
			await queryRunner.release();
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
