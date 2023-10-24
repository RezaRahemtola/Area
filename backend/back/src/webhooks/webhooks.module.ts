import { Module } from "@nestjs/common";
import { WebhooksController } from "./webhooks.controller";
import { GithubWebhookService } from "./services/gihub-webhook.service";
import { GrpcModule } from "../grpc/grpc.module";

@Module({
	imports: [GrpcModule],
	controllers: [WebhooksController],
	providers: [GithubWebhookService],
})
export class WebhooksModule {}
