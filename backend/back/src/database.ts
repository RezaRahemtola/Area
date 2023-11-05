import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { User } from "./users/entities/user.entity";
import Service from "./services/entities/service.entity";
import ServiceScope from "./services/entities/service-scope.entity";
import UserConnection from "./connections/entities/user-connection.entity";
import Area from "./services/entities/area.entity";
import Workflow from "./workflows/entities/workflow.entity";
import WorkflowArea from "./workflows/entities/workflow-area.entity";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { Seeding1696697017387 } from "./migrations/1696697017387-Seeding";
import { CreateGithubService1696697379896 } from "./services/seed/1696697379896-CreateGithubService";
import { CreateGithubServiceScopes1696697647435 } from "./services/seed/1696697647435-CreateGithubServiceScopes";
import { WorkflowAreaJobId1696791202100 } from "./migrations/1696791202100-WorkflowAreaJobId";
import { CreateGoogleServiceWithScopes1696808587273 } from "./services/seed/1696808587273-CreateGoogleServiceWithScopes";
import { CreateTimerService1696814128392 } from "./services/seed/1696814128392-CreateTimerService";
import { AreaNeededServiceScopeCascadeDeleteAndUserConnectionTokenToData1696815504752 } from "./migrations/1696815504752-AreaNeededServiceScopeCascadeDeleteAndUserConnectionTokenToData";
import { CreateGoogleSendEmailAndTimerSecondIntervalAreasWithScopes1696815504760 } from "./workflows/seed/1696815504760-CreateGoogleSendEmailAndTimerSecondIntervalAreasWithScopes";
import UserSettings from "./users/entities/user-settings.entity";
import { CreateUserSettingsTable1697135496860 } from "./migrations/1697135496860-CreateUserSettingsTable";
import { AreaParametersFlowAndDescription1697044261933 } from "./migrations/1697044261933-AreaParametersFlowAndDescription";
import { AddDescriptionAndFormFlowsForCurrentAreas1697044397539 } from "./workflows/seed/1697044397539-AddDescriptionAndFormFlowsForCurrentAreas";
import { CreateTwitterServiceWithScopes1697238715858 } from "./services/seed/1697238715858-CreateTwitterServiceWithScopes";
import { CreateGoogleCreateDraftMailArea1697391501370 } from "./workflows/seed/1697391501370-CreateGoogleCreateDraftMailArea";
import { CreateGoogleUpdateSignatureEmailArea1697402750753 } from "./workflows/seed/1697402750753-CreateGoogleUpdateSignatureEmailArea";
import { CreateGoogleYoutubeCreateCommentArea1697407782601 } from "./workflows/seed/1697407782601CreateGoogleYoutubeCreateCommentArea";
import { CreateLinkedInServiceAndScopes1697410039086 } from "./services/seed/1697410039086-CreateLinkedInServiceAndScopes";
import { CreateGoogleDocsCreateDocumentArea1697417929723 } from "./workflows/seed/1697417929723-CreateGoogleDocsCreateDocumentArea";
import { CreateGoogleSlidesPresentationArea1697441436959 } from "./workflows/seed/1697441436959-CreateGoogleSlidesPresentationArea";
import { CreateGoogleSpreadsheetArea1697442335135 } from "./workflows/seed/1697442335135-CreateGoogleSpreadsheetArea";
import { CreateGoogleCreateFormArea1697476339491 } from "./workflows/seed/1697476339491-CreateGoogleCreateFormArea";
import { UpdateGoogleServiceFormsScopes1697460124931 } from "./services/seed/1697460124931-UpdateGoogleServiceFormsScopes-seed";
import { CreateGoogleCreateContactArea1697484676351 } from "./workflows/seed/1697484676351-CreateGoogleCreateContactArea";
import { CreateMicrosoftServiceAndScopes1697423320221 } from "./services/seed/1697665090584-CreateMicrosoftServiceAndScopes";
import { CreateFacebookServiceWithScopes1697687427741 } from "./services/seed/1697687427741-CreateFacebookServiceWithScopes";
import { CreateLinkedInCreatePostArea1697628194232 } from "./workflows/seed/1697628194232-CreateLinkedInCreatePostArea";
import { CreateMiroServiceWithScopes1697776146331 } from "./services/seed/1697776146331-CreateMiroServiceWithScopes";
import { CreateGoogleTaskList1697746992707 } from "./workflows/seed/1697746992707-CreateGoogleTaskList";
import { CreateGoogleCourseArea1697750743177 } from "./workflows/seed/1697750743177-CreateGoogleCourseArea";
import { CreateGoogleCalendarArea1697892875843 } from "./workflows/seed/1697892875843-CreateGoogleCalendarArea";
import { CreateGoogleDriveFolderArea1697900447428 } from "./workflows/seed/1697900447428-CreateGoogleDriveFolderArea";
import { DuplicateGoogleDriveFileArea1697902627105 } from "./workflows/seed/1697902627105-DuplicateGoogleDriveFileArea";
import { CreateGoogleFormYoutubeItem1697907107855 } from "./workflows/seed/1697907107855-CreateGoogleFormYoutubeItem";
import { CreateIssueGithubReaction1698062010534 } from "./workflows/seed/1698062010534-CreateIssueGithubReaction";
import { CreateGoogleSlideInPresentationArea1698150990404 } from "./workflows/seed/1698150990404-CreateGoogleSlideInPresentationArea";
import { UpdateServiceImagesToBrandFetchSVGs1698161840408 } from "./services/seed/1698161840408-UpdateServiceImagesToBrandFetchSVGs";
import { CreateGithubOnIssueCreationArea1698179108023 } from "./workflows/seed/1698179108023-CreateGithubOnIssueCreationArea";
import { CreateGoogleSharedDriveArea1698266623053 } from "./workflows/seed/1698266623053-CreateGoogleSharedDriveArea";
import { CreateGoogleChangeGmailInterfaceLanguageArea1698268856232 } from "./workflows/seed/1698268856232-CreateGoogleChangeGmailInterfaceLanguageArea";
import { RemoveMicrosoftServiceAndCreateMicrosoftSubServices1698260218158 } from "./services/seed/1698260218158-RemoveMicrosoftServiceAndCreateMicrosoftSubServices";
import { CreateGoogleOnNewVideo1698251712512 } from "./workflows/seed/1698251712512-CreateGoogleOnNewVideo";
import { CreateDiscordServiceWithScopes1698325062489 } from "./services/seed/1698325062489-CreateDiscordServiceWithScopes";
import { CreateLinearServiceWithScopes1698322805180 } from "./services/seed/1698322805180-CreateLinearServiceWithScopes";
import { CreateGitLabServiceWithScopes1698332919825 } from "./services/seed/1698332919825-CreateGitLabServiceWithScopes";
import { CreateGithubIssuesAreas1698331915608 } from "./workflows/seed/1698331915608-CreateGithubIssuesAreas";
import { CreateGithubCommitPRAreas1698353438280 } from "./workflows/seed/1698353438280-CreateGithubCommitPRAreas";
import { UpdateTimerServiceImage1698259539325 } from "./services/seed/1698259539325-UpdateTimerServiceImage";
import { UpdateMiroServiceImageForMobile1698590831862 } from "./services/seed/1698590831862-UpdateMiroServiceImageForMobile";
import { WorkflowAreaReturnParams1698521602687 } from "./migrations/1698521602687-WorkflowAreaReturnParams";
import { CreateGoogleFormUpdateDescriptionArea1698654637708 } from "./workflows/seed/1698654637708-CreateGoogleFormUpdateDescriptionArea";
import { CreateGoogleFormConvertToQuizArea1698655334570 } from "./workflows/seed/1698655334570-CreateGoogleFormConvertToQuizArea";
import { CreateGoogleUpdateSpreadsheetTitleArea1698656017859 } from "./workflows/seed/1698656017859-CreateGoogleUpdateSpreadsheetTitleArea";
import { CreateLinearCreateIssueAreas1698614949784 } from "./workflows/seed/1698614949784-CreateLinearCreateIssueAreas";
import { CreateGitlabCommitPRActions1698678924392 } from "./workflows/seed/1698678924392-CreateGitlabCommitPRActions";
import { CreateMiroCreateBoardReaction1698793446046 } from "./workflows/seed/1698793446046-CreateMiroCreateBoardReaction";
import { UpdateGoogleServiceScopes1698414179394 } from "./services/seed/1698414179394-UpdateGoogleServiceScopes";
import { CreateAirTableServiceAndScopes1698856388828 } from "./services/seed/1698856388828-CreateAirTableServiceAndScopes";
import { FixGitLabOnPRAreasScope1698860681718 } from "./workflows/seed/1698860681718-FixGitLabOnPRAreasScope";
import { CreateSlackServiceWithScopes1698870517052 } from "./services/seed/1698870517052-CreateSlackServiceWithScopes";
import { MakePasswordHashNullable1698408481880 } from "./migrations/1698408481880-MakePasswordHashNullable";
import { CreateFacebookStatusCreateAction1698789169408 } from "./workflows/seed/1698789169408-CreateFacebookStatusCreateAction";
import { CreateTodoistServiceWithScopes1698981275393 } from "./services/seed/1698981275393-CreateTodoistServiceWithScopes";
import { ChangeUserSettingsLanguageEnumAndAddAreaDefaultParameterReturnFlowValue1698986506624 } from "./migrations/1698986506624-ChangeUserSettingsLanguageEnumAndAddAreaDefaultParameterReturnFlowValue";
import ActivityLog from "./activity/entities/activity-log.entity";
import { AddActivityLogEntity1698986590525 } from "./migrations/1698986590525-AddActivityLogEntity";
import { CreateRiotGamesService1698964479750 } from "./services/seed/1698964479750-CreateRiotGamesService";
import { CreateRiotGamesActions1698964479850 } from "./workflows/seed/1698964479850-CreateRiotGamesActions";
import { CreateTodoistCreateTaskReaction1699101589099 } from "./workflows/seed/1699101589099-CreateTodoistCreateTaskReaction";
import { CreateAirtableDeleteRecordReaction1699107944021 } from "./workflows/seed/1699107944021-CreateAirtableDeleteRecordReaction";
import { CreateTwitterCreateTweetReaction1699115775099 } from "./workflows/seed/1699115775099-CreateTwitterCreateTweetReaction";
import { ChangeRiotLogoToSvg1699116526789 } from "./services/seed/1699116526789-ChangeRiotLogoToSvg";
import { CreateOutlookSendEmailReaction1699126617355 } from "./workflows/seed/1699126617355-CreateOutlookSendEmailReaction";
import { CreateSlackCreateMessageReaction1699131357051 } from "./workflows/seed/1699131357051-CreateSlackCreateMessageReaction";
import { CreateDiscordOnGuildJoinAction1699140593736 } from "./workflows/seed/1699140593736-CreateDiscordOnGuildJoinAction";
import { CreateTodoistTaskReactions1699140054686 } from "./workflows/seed/1699140054686-CreateTodoistTaskReactions";
import { CreateAreaService1699143731594 } from "./services/seed/1699143731594-CreateAreaService";
import { CreateAreaOnActionAction1699145276143 } from "./workflows/seed/1699145276143-CreateAreaOnActionAction";
import { CreateAreaAreas1699152935342 } from "./workflows/seed/1699152935342-CreateAreaAreas";
import { FixAddScopeToLinearOnIssueCreate1699190007820 } from "./workflows/seed/1699190007820-FixAddScopeToLinearOnIssueCreate";

dotenv.config();

export const DATA_SOURCE_OPTIONS: DataSourceOptions = {
	type: "postgres",
	namingStrategy: new SnakeNamingStrategy(),
	host: process.env.DB_HOST,
	port: process.env.DB_PORT as unknown as number,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [User, Service, ServiceScope, UserConnection, Area, Workflow, WorkflowArea, UserSettings, ActivityLog],
	migrations: [
		Seeding1696697017387,
		CreateGithubService1696697379896,
		CreateGithubServiceScopes1696697647435,
		WorkflowAreaJobId1696791202100,
		CreateGoogleServiceWithScopes1696808587273,
		CreateTimerService1696814128392,
		AreaNeededServiceScopeCascadeDeleteAndUserConnectionTokenToData1696815504752,
		CreateGoogleSendEmailAndTimerSecondIntervalAreasWithScopes1696815504760,
		CreateUserSettingsTable1697135496860,
		AreaParametersFlowAndDescription1697044261933,
		AddDescriptionAndFormFlowsForCurrentAreas1697044397539,
		CreateTwitterServiceWithScopes1697238715858,
		CreateGoogleCreateDraftMailArea1697391501370,
		CreateGoogleUpdateSignatureEmailArea1697402750753,
		CreateGoogleYoutubeCreateCommentArea1697407782601,
		CreateLinkedInServiceAndScopes1697410039086,
		CreateGoogleDocsCreateDocumentArea1697417929723,
		CreateGoogleSlidesPresentationArea1697441436959,
		CreateGoogleSpreadsheetArea1697442335135,
		UpdateGoogleServiceFormsScopes1697460124931,
		CreateGoogleCreateFormArea1697476339491,
		CreateGoogleCreateContactArea1697484676351,
		CreateMicrosoftServiceAndScopes1697423320221,
		CreateLinkedInCreatePostArea1697628194232,
		CreateFacebookServiceWithScopes1697687427741,
		CreateGoogleTaskList1697746992707,
		CreateGoogleCourseArea1697750743177,
		CreateMiroServiceWithScopes1697776146331,
		CreateGoogleCalendarArea1697892875843,
		CreateGoogleDriveFolderArea1697900447428,
		DuplicateGoogleDriveFileArea1697902627105,
		CreateGoogleFormYoutubeItem1697907107855,
		CreateIssueGithubReaction1698062010534,
		CreateGoogleSlideInPresentationArea1698150990404,
		UpdateServiceImagesToBrandFetchSVGs1698161840408,
		CreateGithubOnIssueCreationArea1698179108023,
		UpdateTimerServiceImage1698259539325,
		RemoveMicrosoftServiceAndCreateMicrosoftSubServices1698260218158,
		CreateGoogleSharedDriveArea1698266623053,
		CreateGoogleChangeGmailInterfaceLanguageArea1698268856232,
		CreateGoogleOnNewVideo1698251712512,
		CreateDiscordServiceWithScopes1698325062489,
		CreateLinearServiceWithScopes1698322805180,
		CreateGitLabServiceWithScopes1698332919825,
		CreateGithubIssuesAreas1698331915608,
		CreateGithubCommitPRAreas1698353438280,
		MakePasswordHashNullable1698408481880,
		UpdateMiroServiceImageForMobile1698590831862,
		WorkflowAreaReturnParams1698521602687,
		CreateGoogleFormUpdateDescriptionArea1698654637708,
		CreateGoogleFormConvertToQuizArea1698655334570,
		CreateGoogleUpdateSpreadsheetTitleArea1698656017859,
		CreateLinearCreateIssueAreas1698614949784,
		CreateGitlabCommitPRActions1698678924392,
		CreateMiroCreateBoardReaction1698793446046,
		UpdateGoogleServiceScopes1698414179394,
		CreateAirTableServiceAndScopes1698856388828,
		FixGitLabOnPRAreasScope1698860681718,
		CreateFacebookStatusCreateAction1698789169408,
		CreateSlackServiceWithScopes1698870517052,
		CreateTodoistServiceWithScopes1698981275393,
		ChangeUserSettingsLanguageEnumAndAddAreaDefaultParameterReturnFlowValue1698986506624,
		AddActivityLogEntity1698986590525,
		CreateRiotGamesService1698964479750,
		CreateRiotGamesActions1698964479850,
		CreateTodoistCreateTaskReaction1699101589099,
		CreateAirtableDeleteRecordReaction1699107944021,
		CreateTwitterCreateTweetReaction1699115775099,
		ChangeRiotLogoToSvg1699116526789,
		CreateOutlookSendEmailReaction1699126617355,
		CreateSlackCreateMessageReaction1699131357051,
		CreateDiscordOnGuildJoinAction1699140593736,
		CreateTodoistTaskReactions1699140054686,
		CreateAreaService1699143731594,
		CreateAreaOnActionAction1699145276143,
		CreateAreaAreas1699152935342,
		FixAddScopeToLinearOnIssueCreate1699190007820,
	],
	synchronize: process.env.NODE_ENV === "development",
};
export default new DataSource(DATA_SOURCE_OPTIONS);
