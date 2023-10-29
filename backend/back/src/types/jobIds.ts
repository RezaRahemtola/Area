import { JobsParams, JobsType } from "./jobs";

type JobsIdentifiers = {
	[key in JobsType]: (obj: JobsParams["mappings"][key]) => string;
};

function uniqueJobId(jobId: string, workflowStepId: string) {
	return `${jobId}-${workflowStepId}`;
}

function uniqueWebhookId(service: string, webhookId: string) {
	return `${service}-${webhookId}`;
}

export const JobsIdentifiers: JobsIdentifiers = {
	"github-close-issue": ({ workflowStepId }) => uniqueJobId("github-close-issue", workflowStepId),
	"github-create-issue": ({ workflowStepId }) => uniqueJobId("github-create-issue", workflowStepId),
	"github-reopen-issue": ({ workflowStepId }) => uniqueJobId("github-reopen-issue", workflowStepId),
	"github-on-commit": ({ owner, repo }) => uniqueWebhookId("github", `${owner}/${repo}`),
	"github-on-issue-close": ({ owner, repo }) => uniqueWebhookId("github", `${owner}/${repo}`),
	"github-on-issue-create": ({ owner, repo }) => uniqueWebhookId("github", `${owner}/${repo}`),
	"github-on-issue-reopen": ({ owner, repo }) => uniqueWebhookId("github", `${owner}/${repo}`),
	"github-on-pull-request-close": ({ owner, repo }) => uniqueWebhookId("github", `${owner}/${repo}`),
	"github-on-pull-request-create": ({ owner, repo }) => uniqueWebhookId("github", `${owner}/${repo}`),
	"github-on-pull-request-merge": ({ owner, repo }) => uniqueWebhookId("github", `${owner}/${repo}`),
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
	"google-duplicate-drive-file": ({ workflowStepId }) => uniqueJobId("google-duplicate-drive-file", workflowStepId),
	"google-on-new-video": ({ channelId }) => `google-on-new-video-${channelId}`,
	"google-send-email": ({ workflowStepId }) => uniqueJobId("google-send-email", workflowStepId),
	"google-update-signature-email": ({ workflowStepId }) => uniqueJobId("google-update-signature-email", workflowStepId),
	"linear-on-issue-create": ({ workspace }) => uniqueWebhookId("linear-on-issue-create", workspace),
	"linkedin-create-post": ({ workflowStepId }) => uniqueJobId("linkedin-create-post", workflowStepId),
	"timer-seconds-interval": ({ workflowStepId }) => uniqueJobId("timer-seconds-interval", workflowStepId),
};
