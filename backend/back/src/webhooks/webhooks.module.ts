import { Module } from "@nestjs/common";
import { WebhooksController } from "./webhooks.controller";
import { GithubWebhookService } from "./services/gihub-webhook.service";
import { GrpcModule } from "../grpc/grpc.module";
import { LinearWebhookService } from "./services/linear-webhook.service";

@Module({
	imports: [GrpcModule],
	controllers: [WebhooksController],
	providers: [GithubWebhookService, LinearWebhookService],
})
export class WebhooksModule {}
