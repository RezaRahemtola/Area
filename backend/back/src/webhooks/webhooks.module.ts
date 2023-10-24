import { Module } from "@nestjs/common";
import { WebhooksController } from "./webhooks.controller";
import { ConfigModule } from "@nestjs/config";
import { GithubWebhookService } from "./services/gihub-webhook.service";
import { GrpcModule } from "../grpc/grpc.module";

@Module({
	imports: [ConfigModule.forRoot(), GrpcModule],
	controllers: [WebhooksController],
	providers: [GithubWebhookService],
})
export class WebhooksModule {}
