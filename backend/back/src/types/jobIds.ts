import { JobsParams, JobsType } from "./jobs";

type JobsIdentifiers = {
	[key in JobsType]: (obj: JobsParams[key]) => `${key}-${string}`;
};

function uniqueJobId<TJobType extends JobsType>(jobId: TJobType, workflowStepId: string): `${TJobType}-${string}` {
	return `${jobId}-${workflowStepId}`;
}

function uniqueWebhookId<TJobType extends JobsType>(jobId: TJobType, webhookId: string): `${TJobType}-${string}` {
	return `${jobId}-${webhookId}`;
}

export const JobsIdentifiers: JobsIdentifiers = {
	"airtable-delete-record": ({ workflowStepId }) => uniqueJobId("airtable-delete-record", workflowStepId),
	"area-on-action": ({ ownerId }) => `area-on-action-${ownerId}`,
	"discord-on-guild-join": ({ workflowStepId }) => uniqueJobId("discord-on-guild-join", workflowStepId),
	"facebook-on-status-create": ({ pageId }) => uniqueWebhookId("facebook-on-status-create", pageId),
	"github-close-issue": ({ workflowStepId }) => uniqueJobId("github-close-issue", workflowStepId),
	"github-create-issue": ({ workflowStepId }) => uniqueJobId("github-create-issue", workflowStepId),
	"github-reopen-issue": ({ workflowStepId }) => uniqueJobId("github-reopen-issue", workflowStepId),
	"github-on-commit": ({ owner, repo }) => uniqueWebhookId("github-on-commit", `${owner}/${repo}`),
	"github-on-issue-close": ({ owner, repo }) => uniqueWebhookId("github-on-issue-close", `${owner}/${repo}`),
	"github-on-issue-create": ({ owner, repo }) => uniqueWebhookId("github-on-issue-create", `${owner}/${repo}`),
	"github-on-issue-reopen": ({ owner, repo }) => uniqueWebhookId("github-on-issue-reopen", `${owner}/${repo}`),
	"github-on-pull-request-close": ({ owner, repo }) =>
		uniqueWebhookId("github-on-pull-request-close", `${owner}/${repo}`),
	"github-on-pull-request-create": ({ owner, repo }) =>
		uniqueWebhookId("github-on-pull-request-create", `${owner}/${repo}`),
	"github-on-pull-request-merge": ({ owner, repo }) =>
		uniqueWebhookId("github-on-pull-request-merge", `${owner}/${repo}`),
	"gitlab-on-commit": ({ projectId }) => uniqueWebhookId("gitlab-on-commit", projectId),
	"gitlab-on-pull-request-close": ({ projectId }) => uniqueWebhookId("gitlab-on-pull-request-close", projectId),
	"gitlab-on-pull-request-create": ({ projectId }) => uniqueWebhookId("gitlab-on-pull-request-create", projectId),
	"gitlab-on-pull-request-merge": ({ projectId }) => uniqueWebhookId("gitlab-on-pull-request-merge", projectId),
	"gitlab-on-pull-request-reopen": ({ projectId }) => uniqueWebhookId("gitlab-on-pull-request-reopen", projectId),
	"google-change-gmail-interface-language": ({ workflowStepId }) =>
		uniqueJobId("google-change-gmail-interface-language", workflowStepId),
	"google-create-calendar": ({ workflowStepId }) => uniqueJobId("google-create-calendar", workflowStepId),
	"google-create-comment-youtube": ({ workflowStepId }) => uniqueJobId("google-create-comment-youtube", workflowStepId),
	"google-create-contact": ({ workflowStepId }) => uniqueJobId("google-create-contact", workflowStepId),
	"google-create-course": ({ workflowStepId }) => uniqueJobId("google-create-course", workflowStepId),
	"google-create-document-docs": ({ workflowStepId }) => uniqueJobId("google-create-document-docs", workflowStepId),
	"google-create-draft-email": ({ workflowStepId }) => uniqueJobId("google-create-draft-email", workflowStepId),
	"google-create-drive-folder": ({ workflowStepId }) => uniqueJobId("google-create-drive-folder", workflowStepId),
	"google-create-form": ({ workflowStepId }) => uniqueJobId("google-create-form", workflowStepId),
	"google-create-presentation": ({ workflowStepId }) => uniqueJobId("google-create-presentation", workflowStepId),
	"google-create-shared-drive": ({ workflowStepId }) => uniqueJobId("google-create-shared-drive", workflowStepId),
	"google-create-slide-on-presentation": ({ workflowStepId }) =>
		uniqueJobId("google-create-slide-on-presentation", workflowStepId),
	"google-create-spreadsheet": ({ workflowStepId }) => uniqueJobId("google-create-spreadsheet", workflowStepId),
	"google-create-task-list": ({ workflowStepId }) => uniqueJobId("google-create-task-list", workflowStepId),
	"google-form-add-youtube-item": ({ workflowStepId }) => uniqueJobId("google-form-add-youtube-item", workflowStepId),
	"google-form-convert-to-quiz": ({ workflowStepId }) => uniqueJobId("google-form-convert-to-quiz", workflowStepId),
	"google-form-update-description": ({ workflowStepId }) =>
		uniqueJobId("google-form-update-description", workflowStepId),
	"google-duplicate-drive-file": ({ workflowStepId }) => uniqueJobId("google-duplicate-drive-file", workflowStepId),
	"google-on-new-video": ({ channelId }) => `google-on-new-video-${channelId}`,
	"google-send-email": ({ workflowStepId }) => uniqueJobId("google-send-email", workflowStepId),
	"google-update-spreadsheet-title": ({ workflowStepId }) =>
		uniqueJobId("google-update-spreadsheet-title", workflowStepId),
	"google-update-signature-email": ({ workflowStepId }) => uniqueJobId("google-update-signature-email", workflowStepId),
	"linear-create-issue": ({ workflowStepId }) => uniqueJobId("linear-create-issue", workflowStepId),
	"linear-on-issue-create": ({ workspace }) => uniqueWebhookId("linear-on-issue-create", workspace),
	"linkedin-create-post": ({ workflowStepId }) => uniqueJobId("linkedin-create-post", workflowStepId),
	"microsoft-outlook-send-email": ({ workflowStepId }) => uniqueJobId("microsoft-outlook-send-email", workflowStepId),
	"miro-create-board": ({ workflowStepId }) => uniqueJobId("miro-create-board", workflowStepId),
	"riot-lol-on-game-end": ({ region, summoner }) => `riot-lol-on-game-end-${region}-${summoner}`,
	"riot-lol-on-game-loss": ({ region, summoner }) => `riot-lol-on-game-loss-${region}-${summoner}`,
	"riot-lol-on-game-win": ({ region, summoner }) => `riot-lol-on-game-win-${region}-${summoner}`,
	"riot-lol-on-level-up": ({ region, summoner }) => `riot-lol-on-level-up-${region}-${summoner}`,
	"slack-create-message": ({ workflowStepId }) => uniqueJobId("slack-create-message", workflowStepId),
	"timer-seconds-interval": ({ workflowStepId }) => uniqueJobId("timer-seconds-interval", workflowStepId),
	"todoist-close-task": ({ workflowStepId }) => uniqueJobId("todoist-close-task", workflowStepId),
	"todoist-create-task": ({ workflowStepId }) => uniqueJobId("todoist-create-task", workflowStepId),
	"todoist-delete-task": ({ workflowStepId }) => uniqueJobId("todoist-delete-task", workflowStepId),
	"todoist-reopen-task": ({ workflowStepId }) => uniqueJobId("todoist-reopen-task", workflowStepId),
	"todoist-update-task": ({ workflowStepId }) => uniqueJobId("todoist-update-task", workflowStepId),
	"twitter-create-tweet": ({ workflowStepId }) => uniqueJobId("twitter-create-tweet", workflowStepId),
};
