import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { User } from "./users/entities/user.entity";
import Service from "./services/entities/service.entity";
import ServiceScope from "./services/entities/service-scope.entity";
import UserConnection from "./connections/entities/user-connection.entity";
import Area from "./services/entities/area.entity";
import Workflow from "./workflows/entities/workflow.entity";
import WorkflowArea from "./workflows/entities/workflow-area.entity";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { Seeding1696697017387 } from "./migrations/1696697017387-Seeding";
import { CreateGithubService1696697379896 } from "./services/seed/1696697379896-CreateGithubService";
import { CreateGithubServiceScopes1696697647435 } from "./services/seed/1696697647435-CreateGithubServiceScopes";
import { WorkflowAreaJobId1696791202100 } from "./migrations/1696791202100-WorkflowAreaJobId";
import { CreateGoogleServiceWithScopes1696808587273 } from "./services/seed/1696808587273-CreateGoogleServiceWithScopes";

dotenv.config();

export const DATA_SOURCE_OPTIONS: DataSourceOptions = {
	type: "postgres",
	namingStrategy: new SnakeNamingStrategy(),
	host: process.env.DB_HOST,
	port: process.env.DB_PORT as unknown as number,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [User, Service, ServiceScope, UserConnection, Area, Workflow, WorkflowArea],
	migrations: [
		Seeding1696697017387,
		CreateGithubService1696697379896,
		CreateGithubServiceScopes1696697647435,
		WorkflowAreaJobId1696791202100,
		CreateGoogleServiceWithScopes1696808587273,
	],
	synchronize: process.env.NODE_ENV === "development",
};
export default new DataSource(DATA_SOURCE_OPTIONS);
