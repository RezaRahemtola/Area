import { Body, Controller, Headers, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { GithubWebhookService } from "./services/gihub-webhook.service";

@Controller("webhooks")
export class WebhooksController {
	constructor(private readonly githubWebhookService: GithubWebhookService) {}

	@ApiOperation({ summary: "Github Webhook calls" })
	@Post("github")
	async onGithubWebhook(@Headers("X-Hub-Signature-256") signature: string, @Body() body: unknown): Promise<void> {
		return this.githubWebhookService.onGithubWebhook(signature, body);
	}
}
