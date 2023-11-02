import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class UniqueJobParams {
	@IsUUID(4)
	workflowStepId: string;
}

export class TimerSecondIntervalParams extends UniqueJobParams {
	@IsNumber()
	seconds: number;
}

export class GoogleEmailParams extends UniqueJobParams {
	@IsEmail()
	to: string;

	@IsString()
	subject: string;

	@IsString()
	body: string;
}

export class GoogleEmailSignatureUpdateParams extends UniqueJobParams {
	@IsString()
	signature: string;
}

export class GoogleYoutubeCreateCommentParams extends UniqueJobParams {
	@IsString()
	videoId: string;

	@IsString()
	content: string;
}

export class NameParams extends UniqueJobParams {
	@IsString()
	name: string;
}

export class GoogleCreateContactParams extends UniqueJobParams {
	@IsString()
	firstName: string;

	@IsString()
	lastName: string;
}

export class LinkedinCreatePostParams extends UniqueJobParams {
	@IsString()
	content: string;

	@IsString()
	articleLink: string;

	@IsString()
	articleDescription: string;
}

export class TitleParams extends UniqueJobParams {
	@IsString()
	title: string;
}

export class GoogleCreateCourseParams extends UniqueJobParams {
	@IsString()
	name: string;

	@IsString()
	description: string;
}

export class GoogleDuplicateDriveFileParams extends UniqueJobParams {
	@IsString()
	fileId: string;

	@IsString()
	name: string;
}

export class GoogleAddFormYoutubeItemParams extends UniqueJobParams {
	@IsString()
	formId: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsString()
	youtubeUrl: string;
}

export class GithubCreateIssueParams extends UniqueJobParams {
	@IsString()
	owner: string;

	@IsString()
	repo: string;

	@IsString()
	title: string;

	@IsString()
	@IsOptional()
	body: string;

	@IsString({ each: true })
	@IsOptional()
	assignees: string[];

	@IsString({ each: true })
	@IsOptional()
	labels: string[];
}

export class GithubReopenIssueParams extends UniqueJobParams {
	@IsString()
	owner: string;

	@IsString()
	repo: string;

	@IsNumber()
	issueNumber: number;
}

export class GithubCloseIssueParams extends GithubReopenIssueParams {
	@IsBoolean()
	@IsOptional()
	completed: boolean;
}

export class GithubRepositoryActionParams {
	@IsString()
	owner: string;

	@IsString()
	repo: string;
}

export class GitlabRepositoryActionParams {
	@IsString()
	projectId: string;
}

export class GoogleCreateSlideOnPresentationParams extends UniqueJobParams {
	@IsString()
	presentationId: string;
}

export class GoogleChangeGmailLanguageParams extends UniqueJobParams {
	@IsString()
	language: string;
}

export class YoutubeChannelParams {
	@IsString()
	channelId: string;
}

export class GoogleFormUpdateDescriptionParams extends UniqueJobParams {
	@IsString()
	formId: string;

	@IsString()
	description: string;
}

export class GoogleFormConvertToQuizParams extends UniqueJobParams {
	@IsString()
	formId: string;
}

export class GoogleFormUpdateSpreadsheetTitleParams extends UniqueJobParams {
	@IsString()
	spreadsheetId: string;

	@IsString()
	title: string;
}

export class LinearWorkspaceParams {
	@IsString()
	workspace: string;
}

export enum LinearIssuePriority {
	Low = "Low",
	Medium = "Medium",
	High = "High",
	Urgent = "Urgent",
}

export class LinearCreateIssueParams extends UniqueJobParams {
	@IsString()
	title: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsNumber()
	@IsOptional()
	estimate: number;

	@IsEnum(LinearIssuePriority)
	@IsOptional()
	priority: LinearIssuePriority;
}

export class MiroCreateBoardParams extends UniqueJobParams {
	@IsString()
	name: string;

	@IsString()
	description: string;
}
