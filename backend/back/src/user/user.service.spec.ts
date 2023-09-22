import { UserService } from "./user.service";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

type MockType<T> = {
	[P in keyof T]?: jest.Mock<NonNullable<unknown>>;
};

const repositoryMockFactory: <T>() => MockType<Repository<T>> = jest.fn(() => ({
	findOne: jest.fn(),
	insert: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	exist: jest.fn(),
}));

describe("UserService", () => {
	let userService: UserService;
	let repositoryMock: MockType<Repository<User>>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserService, { provide: getRepositoryToken(User), useFactory: repositoryMockFactory }],
		}).compile();
		userService = module.get<UserService>(UserService);
		repositoryMock = module.get(getRepositoryToken(User));
	});

	const user = {
		id: "475d94b1-90b2-431a-bfa0-0a805f81b3b4",
		mail: "john.smith@cramptarea.org",
		passwordHash: "$argon2d$v=19$m=16,t=2,p=1$T0dSTTRDVE5IdUpVMXNFdg$/ydwhzzjLeDsSlFG7wyZ9Q",
		isAdmin: false,
		totpSecret: null,
		createdAt: new Date("2001-09-11T00:00:00.000Z"),
	};

	it("should find an user", async () => {
		repositoryMock.findOne.mockReturnValue(Promise.resolve(user));
		expect(await userService.getUser({ id: user.id })).toEqual(user);
		expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
	});

	it("should find no user", async () => {
		repositoryMock.findOne.mockReturnValue(Promise.resolve(null));
		expect(await userService.getUser({ id: user.id })).toEqual(null);
		expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
	});

	it("should create an user and return true", async () => {
		repositoryMock.insert.mockReturnValue(Promise.resolve({ identifiers: [{ id: user.id }] }));
		expect(await userService.createUser(user.mail, user.passwordHash, user.isAdmin)).toEqual(true);
		expect(repositoryMock.insert).toHaveBeenCalledWith({
			mail: user.mail,
			passwordHash: user.passwordHash,
			isAdmin: user.isAdmin,
		});
	});

	it("should not create an user and return false because the user's mail is already used", async () => {
		repositoryMock.insert.mockReturnValue(
			Promise.reject(new Error("duplicated mail value violates unique constraint")),
		);
		expect(await userService.createUser("other.mail@cramptarea.org", user.passwordHash, user.isAdmin)).toEqual(false);
		expect(repositoryMock.insert).toHaveBeenCalledWith({
			mail: "other.mail@cramptarea.org",
			passwordHash: user.passwordHash,
			isAdmin: user.isAdmin,
		});
	});

	it("should update a user according to the parameters passed and return true", async () => {
		repositoryMock.exist.mockReturnValue(Promise.resolve(true));
		repositoryMock.update.mockReturnValue(Promise.resolve({ affected: 1 }));
		expect(await userService.updateUser({ id: user.id }, { isAdmin: true })).toEqual(true);
		expect(repositoryMock.exist).toHaveBeenCalledWith({ where: { id: user.id } });
		expect(repositoryMock.update).toHaveBeenCalledWith({ id: user.id }, { isAdmin: true });
	});

	it("should not update an user and return false because the new user's mail is already used by another user", async () => {
		repositoryMock.exist.mockReturnValue(Promise.resolve(true));
		repositoryMock.update.mockReturnValue(
			Promise.reject(new Error("duplicated mail value violates unique constraint")),
		);
		expect(await userService.updateUser({ id: user.id }, { mail: "other.mail@cramptarea.org" })).toEqual(false);
		expect(repositoryMock.exist).toHaveBeenCalledWith({ where: { id: user.id } });
		expect(repositoryMock.update).toHaveBeenCalledWith({ id: user.id }, { mail: "other.mail@cramptarea.org" });
	});

	it("should not update an user and return false because the user does not exists", async () => {
		repositoryMock.exist.mockReturnValue(Promise.resolve(false));
		repositoryMock.update.mockReturnValue(Promise.resolve({ affected: 0 }));
		expect(await userService.updateUser({ id: user.id }, { isAdmin: true })).toEqual(false);
		expect(repositoryMock.exist).toHaveBeenCalledWith({ where: { id: user.id } });
		expect(repositoryMock.update).not.toHaveBeenCalled();
	});

	it("should delete an user and return true", async () => {
		repositoryMock.exist.mockReturnValue(Promise.resolve(true));
		repositoryMock.delete.mockReturnValue(Promise.resolve({ affected: 1 }));
		expect(await userService.deleteUser({ id: user.id })).toEqual(true);
		expect(repositoryMock.exist).toHaveBeenCalledWith({ where: { id: user.id } });
		expect(repositoryMock.delete).toHaveBeenCalledWith({ id: user.id });
	});

	it("should not delete an user and return false because the user does not exists", async () => {
		repositoryMock.exist.mockReturnValue(Promise.resolve(false));
		repositoryMock.delete.mockReturnValue(Promise.resolve({ affected: 0 }));
		expect(await userService.deleteUser({ id: user.id })).toEqual(false);
		expect(repositoryMock.exist).toHaveBeenCalledWith({ where: { id: user.id } });
		expect(repositoryMock.delete).not.toHaveBeenCalled();
	});
});
