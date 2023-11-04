package jobs

var JobToImage = map[string]string{
	"airtable-delete-record":                 "supervisor-airtable",
	"facebook-on-status-create":              "",
	"github-close-issue":                     "supervisor-github",
	"github-create-issue":                    "supervisor-github",
	"github-reopen-issue":                    "supervisor-github",
	"github-on-commit":                       "supervisor-github",
	"github-on-issue-close":                  "supervisor-github",
	"github-on-issue-create":                 "supervisor-github",
	"github-on-issue-reopen":                 "supervisor-github",
	"github-on-pull-request-close":           "supervisor-github",
	"github-on-pull-request-create":          "supervisor-github",
	"gitlab-on-commit":                       "supervisor-gitlab",
	"gitlab-on-pull-request-close":           "supervisor-gitlab",
	"gitlab-on-pull-request-create":          "supervisor-gitlab",
	"gitlab-on-pull-request-merge":           "supervisor-gitlab",
	"gitlab-on-pull-request-reopen":          "supervisor-gitlab",
	"google-change-gmail-interface-language": "supervisor-google",
	"google-create-calendar":                 "supervisor-google",
	"google-create-contact":                  "supervisor-google",
	"google-create-comment-youtube":          "supervisor-google",
	"google-create-course":                   "supervisor-google",
	"google-create-document-docs":            "supervisor-google",
	"google-create-drive-folder":             "supervisor-google",
	"google-create-draft-email":              "supervisor-google",
	"google-create-form":                     "supervisor-google",
	"google-create-presentation":             "supervisor-google",
	"google-create-shared-drive":             "supervisor-google",
	"google-create-slide-on-presentation":    "supervisor-google",
	"google-create-spreadsheet":              "supervisor-google",
	"google-create-task-list":                "supervisor-google",
	"google-duplicate-drive-file":            "supervisor-google",
	"google-form-add-youtube-item":           "supervisor-google",
	"google-form-convert-to-quiz":            "supervisor-google",
	"google-form-update-description":         "supervisor-google",
	"google-on-new-video":                    "supervisor-google",
	"google-send-email":                      "supervisor-google",
	"google-update-spreadsheet-title":        "supervisor-google",
	"google-update-signature-email":          "supervisor-google",
	"linear-create-issue":                    "supervisor-linear",
	"linear-on-issue-create":                 "",
	"linkedin-create-post":                   "supervisor-linkedin",
	"miro-create-board":                      "supervisor-miro",
	"riot-lol-on-game-end":                   "supervisor-riot",
	"riot-lol-on-game-loss":                  "supervisor-riot",
	"riot-lol-on-game-win":                   "supervisor-riot",
	"riot-lol-on-level-up":                   "supervisor-riot",
	"timer-seconds-interval":                 "supervisor-seconds-interval",
	"todoist-create-task":                    "supervisor-todoist",
}

var OptArgument = map[string]string{
	"airtable-delete-record":                 "delete-record",
	"github-close-issue":                     "close-issue",
	"github-create-issue":                    "create-issue",
	"github-reopen-issue":                    "reopen-issue",
	"github-on-commit":                       "setup-webhook",
	"github-on-issue-close":                  "setup-webhook",
	"github-on-issue-create":                 "setup-webhook",
	"github-on-issue-reopen":                 "setup-webhook",
	"github-on-pull-request-close":           "setup-webhook",
	"github-on-pull-request-create":          "setup-webhook",
	"github-on-pull-request-merge":           "setup-webhook",
	"gitlab-on-commit":                       "setup-webhook",
	"gitlab-on-pull-request-close":           "setup-webhook",
	"gitlab-on-pull-request-create":          "setup-webhook",
	"gitlab-on-pull-request-merge":           "setup-webhook",
	"gitlab-on-pull-request-reopen":          "setup-webhook",
	"google-change-gmail-interface-language": "change-gmail-interface-language",
	"google-create-calendar":                 "create-calendar",
	"google-create-comment-youtube":          "create-comment-youtube",
	"google-create-contact":                  "create-contact",
	"google-create-course":                   "create-course",
	"google-create-document-docs":            "create-document-docs",
	"google-create-draft-email":              "create-draft-email",
	"google-create-drive-folder":             "create-drive-folder",
	"google-create-form":                     "create-form",
	"google-create-presentation":             "create-presentation",
	"google-create-shared-drive":             "create-shared-drive",
	"google-create-slide-on-presentation":    "create-slide-on-presentation",
	"google-create-spreadsheet":              "create-spreadsheet",
	"google-create-task-list":                "create-task-list",
	"google-duplicate-drive-file":            "duplicate-drive-file",
	"google-form-add-youtube-item":           "form-add-youtube-item",
	"google-form-convert-to-quiz":            "form-convert-to-quiz",
	"google-form-update-description":         "form-update-description",
	"google-on-new-video":                    "on-youtube-video",
	"google-send-email":                      "send-email",
	"google-update-spreadsheet-title":        "update-spreadsheet-title",
	"google-update-signature-email":          "update-signature-email",
	"linear-create-issue":                    "create-issue",
	"linkedin-create-post":                   "create-post",
	"miro-create-board":                      "create-board",
	"riot-lol-on-game-end":                   "lol-on-game-end",
	"riot-lol-on-game-loss":                  "lol-on-game-end",
	"riot-lol-on-game-win":                   "lol-on-game-end",
	"riot-lol-on-level-up":                   "lol-on-level-up",
	"timer-seconds-interval":                 "",
	"todoist-create-task":                    "create-task",
}

func GetImages() []string {
	v := make([]string, 0, len(JobToImage))

	for _, value := range JobToImage {
		v = append(v, value)
	}
	return v
}
