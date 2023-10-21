import { IsEmail, IsNumber, IsString, IsUUID } from "class-validator";

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
