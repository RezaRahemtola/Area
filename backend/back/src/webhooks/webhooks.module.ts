import { Module } from "@nestjs/common";
import { WebhooksController } from "./webhooks.controller";
import { GithubWebhookService } from "./services/gihub-webhook.service";
import { GrpcModule } from "../grpc/grpc.module";
import { LinearWebhookService } from "./services/linear-webhook.service";
import { FacebookWebhookService } from "./services/facebook-webhook.service";

@Module({
	imports: [GrpcModule],
	controllers: [WebhooksController],
	providers: [FacebookWebhookService, GithubWebhookService, LinearWebhookService],
})
export class WebhooksModule {}
