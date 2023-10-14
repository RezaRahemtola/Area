import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { MockType } from "../types/test";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import LoginResultDto from "./dto/login-result.dto";
import { JwtPayload } from "../types/jwt";

const mockUserService: MockType<UsersService> = {
	getUser: jest.fn(),
	createUser: jest.fn(),
	deleteUser: jest.fn(),
	updateUser: jest.fn(),
};

describe("AuthService", () => {
	let service: AuthService;
	let usersServiceMock: MockType<UsersService>;
	let jwtService: JwtService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService, { provide: UsersService, useValue: mockUserService }],
			imports: [JwtModule.register({ secret: "secret", signOptions: { expiresIn: "1d" } })],
		}).compile();

		service = module.get<AuthService>(AuthService);
		jwtService = module.get<JwtService>(JwtService);
		usersServiceMock = module.get(UsersService);
	});

	const userPassword = "sUp3rP4ssw0rd!";
	const user = {
		id: "475d94b1-90b2-431a-bfa0-0a805f81b3b4",
		email: "john.smith@cramptarea.org",
		passwordHash: "$argon2d$v=19$m=16,t=2,p=1$V0xqSHhkb3Fwc0N5bXF3Zw$jTGF07SNA8vMBUXbJ5B9Ug",
		isAdmin: false,
		totpSecret: null,
		createdAt: new Date("2001-09-11T00:00:00.000Z"),
	};

	describe("logIn", () => {
		it("should return a valid signed JWT with the user's id as a payload", async () => {
			usersServiceMock.getUser.mockReturnValue(Promise.resolve(user));
			const result = await service.logIn(user.email, userPassword);
			expect(result).toEqual<LoginResultDto>({
				accessToken: expect.any(String),
			});
			const verifyResult = jwtService.verify<JwtPayload>(result.accessToken);
			expect(verifyResult).not.toBeNull();
			const { id, iat, exp } = verifyResult;
			expect(id).toEqual<string>(user.id);
			expect(iat).toBeGreaterThan(new Date().getTime() / 1000 - 60 * 2); // 2 minutes ago
			expect(exp).toBeLessThan(new Date().getTime() / 1000 + 60 * 60 * 24 + 60 * 2); // 1 day and 2 minutes from now
			expect(usersServiceMock.getUser).toHaveBeenCalledWith({ email: user.email });
		});

		it("should throw an unauthorized exception as the passed email is unknown and not return a JWT", async () => {
			usersServiceMock.getUser.mockReturnValue(Promise.resolve(null));
			await expect(service.logIn("not.john.smith@cramptarea.org", userPassword)).rejects.toThrow(UnauthorizedException);
			expect(usersServiceMock.getUser).toHaveBeenCalledWith({ email: user.email });
		});

		it("should throw an unauthorized exception as the passed password is not valid and not return a JWT", async () => {
			usersServiceMock.getUser.mockReturnValue(Promise.resolve(user));
			await expect(service.logIn(user.email, "notsUp3rP4ssw0rd!")).rejects.toThrow(UnauthorizedException);
			expect(usersServiceMock.getUser).toHaveBeenCalledWith({ email: user.email });
		});
	});

	describe("register", () => {
		it("should create a user and return a signed JWT with the user's id as a payload", async () => {
			usersServiceMock.createUser.mockReturnValue(Promise.resolve(true));
			usersServiceMock.getUser.mockReturnValue(Promise.resolve(user));
			const result = await service.register(user.email, userPassword);
			expect(result).toEqual<LoginResultDto>({
				accessToken: expect.any(String),
			});
			const verifyResult = jwtService.verify<JwtPayload>(result.accessToken);
			expect(verifyResult).not.toBeNull();
			const { id, iat, exp } = verifyResult;
			expect(id).toEqual<string>(user.id);
			expect(iat).toBeGreaterThan(new Date().getTime() / 1000 - 60 * 2); // 2 minutes ago
			expect(exp).toBeLessThan(new Date().getTime() / 1000 + 60 * 60 * 24 + 60 * 2); // 1 day and 2 minutes from now
			expect(usersServiceMock.createUser).toHaveBeenCalledWith(user.email, expect.any(String));
		});

		it("should throw a conflict exception because a user already exists in te database and not return a JWT", async () => {
			usersServiceMock.createUser.mockReturnValue(Promise.resolve(false));
			await expect(service.register(user.email, userPassword)).rejects.toThrow(ConflictException);
			expect(usersServiceMock.createUser).toHaveBeenCalledWith(user.email, expect.any(String));
		});
	});

	describe("verifyToken", () => {
		it("should return true as the passed JWT is valid and not expired", async () => {
			const result = await service.verifyToken(jwtService.sign({ id: user.id }));
			expect(result).not.toBeNull();
			const { id, iat, exp } = result;
			expect(id).toEqual<string>(user.id);
			expect(iat).toBeGreaterThan(new Date().getTime() / 1000 - 60 * 2); // 2 minutes ago
			expect(exp).toBeLessThan(new Date().getTime() / 1000 + 60 * 60 * 24 + 60 * 2); // 1 day and 2 minutes from now
		});

		it("should return null as the passed JWT is signed with the wrong secret", async () => {
			await expect(
				service.verifyToken(jwtService.sign({ id: user.id }, { secret: "wrong secret" })),
			).resolves.toBeNull();
		});

		it("should return null as the passed JWT is expired", async () => {
			await expect(service.verifyToken(jwtService.sign({ id: user.id }, { expiresIn: 0 }))).resolves.toBeNull();
		});

		it("should return null as the passed JWT is not a valid JWT", async () => {
			await expect(service.verifyToken("not a valid JWT")).resolves.toBeNull();
		});
	});
});
