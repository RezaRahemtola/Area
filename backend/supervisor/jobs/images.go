package jobs

var JobToImage = map[string]string{
	"github-create-issue":                 "supervisor-github",
	"github-on-issue-create":              "supervisor-github",
	"google-create-calendar":              "supervisor-google",
	"google-create-contact":               "supervisor-google",
	"google-create-comment-youtube":       "supervisor-google",
	"google-create-course":                "supervisor-google",
	"google-create-document-docs":         "supervisor-google",
	"google-create-drive-folder":          "supervisor-google",
	"google-create-draft-email":           "supervisor-google",
	"google-create-form":                  "supervisor-google",
	"google-create-presentation":          "supervisor-google",
	"google-create-slide-on-presentation": "supervisor-google",
	"google-create-spreadsheet":           "supervisor-google",
	"google-create-task-list":             "supervisor-google",
	"google-duplicate-drive-file":         "supervisor-google",
	"google-form-add-youtube-item":        "supervisor-google",
	"google-on-new-video":                 "supervisor-google",
	"google-send-email":                   "supervisor-google",
	"google-update-signature-email":       "supervisor-google",
	"linkedin-create-post":                "supervisor-linkedin",
	"timer-seconds-interval":              "supervisor-seconds-interval",
}

var OptArgument = map[string]string{
	"github-create-issue":                 "create-issue",
	"github-on-issue-create":              "setup-webhook",
	"google-create-calendar":              "create-calendar",
	"google-create-comment-youtube":       "create-comment-youtube",
	"google-create-contact":               "create-contact",
	"google-create-course":                "create-course",
	"google-create-document-docs":         "create-document-docs",
	"google-create-draft-email":           "create-draft-email",
	"google-create-drive-folder":          "create-drive-folder",
	"google-create-form":                  "create-form",
	"google-create-presentation":          "create-presentation",
	"google-create-slide-on-presentation": "create-slide-on-presentation",
	"google-create-spreadsheet":           "create-spreadsheet",
	"google-create-task-list":             "create-task-list",
	"google-duplicate-drive-file":         "duplicate-drive-file",
	"google-form-add-youtube-item":        "form-add-youtube-item",
	"google-on-new-video":                 "on-youtube-video",
	"google-send-email":                   "send-email",
	"google-update-signature-email":       "update-signature-email",
	"linkedin-create-post":                "create-post",
	"timer-seconds-interval":              "",
}

func GetImages() []string {
	v := make([]string, 0, len(JobToImage))

	for _, value := range JobToImage {
		v = append(v, value)
	}
	return v
}
