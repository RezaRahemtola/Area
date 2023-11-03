import { Module } from "@nestjs/common";
import { WebhooksController } from "./webhooks.controller";
import { GithubWebhookService } from "./services/gihub-webhook.service";
import { GrpcModule } from "../grpc/grpc.module";
import { LinearWebhookService } from "./services/linear-webhook.service";
import { GitlabWebhookService } from "./services/gitlab-webhook.service";
import { FacebookWebhookService } from "./services/facebook-webhook.service";

@Module({
	imports: [GrpcModule],
	controllers: [WebhooksController],
	providers: [FacebookWebhookService, GithubWebhookService, GitlabWebhookService, LinearWebhookService],
})
export class WebhooksModule {}
