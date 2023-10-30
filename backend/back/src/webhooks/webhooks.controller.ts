import { Body, Controller, Headers, Post } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { GithubWebhookService } from "./services/gihub-webhook.service";
import { LinearWebhookService } from "./services/linear-webhook.service";
import { GitlabWebhookService } from "./services/gitlab-webhook.service";

@Controller("webhooks")
@ApiExcludeController()
export class WebhooksController {
	constructor(
		private readonly githubWebhookService: GithubWebhookService,
        private readonly gitlabWebhookService: GitlabWebhookService,
        private readonly linearWebhookService: LinearWebhookService,
	) {}

	@Post("github")
	async onGithubWebhook(@Headers("X-Hub-Signature-256") signature: string, @Body() body: unknown): Promise<void> {
		return this.githubWebhookService.onGithubWebhook(signature, body);
	}

    @Post("gitlab")
    async onGitlabWebhook(@Headers("X-Gitlab-Token") token: string, @Body() body: unknown): Promise<void> {
        return this.gitlabWebhookService.onGitlabWebhook(token, body);
    }

	@Post("linear")
	async onLinearWebhook(@Headers("linear-signature") signature: string, @Body() body: unknown): Promise<void> {
		return this.linearWebhookService.onLinearWebhook(signature, body);
	}
}
