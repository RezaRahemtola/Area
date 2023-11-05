import { UsersService } from "../users/users.service";
import { ValueProvider } from "@nestjs/common";
import { ConnectionsService } from "../connections/connections.service";

export type MockType<T> = {
	[key in keyof T]: T[key] extends (...args: any[]) => any ? jest.Mock<NonNullable<unknown>> : never;
};

export type ProviderMock<T> = ValueProvider<MockType<T>>;

export const MOCK_USERS_SERVICE: ProviderMock<UsersService> = {
	provide: UsersService,
	useValue: {
		getUser: jest.fn(),
		createUser: jest.fn(),
		deleteUser: jest.fn(),
		updateUser: jest.fn(),
	},
};

export const MOCK_CONNECTIONS_SERVICE: ProviderMock<ConnectionsService> = {
	provide: ConnectionsService,
	useValue: {
		createUserConnection: jest.fn(),
		deleteUserConnection: jest.fn(),
		getUserConnectionForService: jest.fn(),
		createUserAndConnectionForData: jest.fn(),
		getNewScopesForConnection: jest.fn(),
	},
};
