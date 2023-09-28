import { Repository } from "typeorm";

export type MockType<T> = {
	[P in keyof T]?: jest.Mock<NonNullable<unknown>>;
};

export const repositoryMockFactory: <T>() => MockType<Repository<T>> = jest.fn(() => ({
	findOne: jest.fn(),
	insert: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	exist: jest.fn(),
}));
