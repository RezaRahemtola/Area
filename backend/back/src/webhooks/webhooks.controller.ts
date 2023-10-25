import { Body, Controller, Headers, Post } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { GithubWebhookService } from "./services/gihub-webhook.service";

@Controller("webhooks")
@ApiExcludeController()
export class WebhooksController {
	constructor(private readonly githubWebhookService: GithubWebhookService) {}

	@Post("github")
	async onGithubWebhook(@Headers("X-Hub-Signature-256") signature: string, @Body() body: unknown): Promise<void> {
		return this.githubWebhookService.onGithubWebhook(signature, body);
	}
}
