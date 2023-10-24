package jobs

var JobToImage = map[string]string{
	"timer-seconds-interval":              "supervisor-seconds-interval",
	"google-send-email":                   "supervisor-google",
	"google-create-draft-email":           "supervisor-google",
	"google-update-signature-email":       "supervisor-google",
	"google-create-comment-youtube":       "supervisor-google",
	"google-create-document-docs":         "supervisor-google",
	"google-create-presentation":          "supervisor-google",
	"google-create-spreadsheet":           "supervisor-google",
	"google-create-form":                  "supervisor-google",
	"google-create-contact":               "supervisor-google",
	"linkedin-create-post":                "supervisor-linkedin",
	"google-create-task-list":             "supervisor-google",
	"google-create-course":                "supervisor-google",
	"google-create-calendar":              "supervisor-google",
	"google-create-drive-folder":          "supervisor-google",
	"google-duplicate-drive-file":         "supervisor-google",
	"google-form-add-youtube-item":        "supervisor-google",
	"github-create-issue":                 "supervisor-github",
	"google-create-slide-on-presentation": "supervisor-google",
}

var OptArgument = map[string]string{
	"timer-seconds-interval":              "",
	"google-send-email":                   "send-email",
	"google-create-draft-email":           "create-draft-email",
	"google-update-signature-email":       "update-signature-email",
	"google-create-comment-youtube":       "create-comment-youtube",
	"google-create-document-docs":         "create-document-docs",
	"google-create-presentation":          "create-presentation",
	"google-create-spreadsheet":           "create-spreadsheet",
	"google-create-form":                  "create-form",
	"google-create-contact":               "create-contact",
	"linkedin-create-post":                "create-post",
	"google-create-task-list":             "create-task-list",
	"google-create-course":                "create-course",
	"google-create-calendar":              "create-calendar",
	"google-create-drive-folder":          "create-drive-folder",
	"google-duplicate-drive-file":         "duplicate-drive-file",
	"google-form-add-youtube-item":        "form-add-youtube-item",
	"github-create-issue":                 "create-issue",
	"google-create-slide-on-presentation": "create-slide-on-presentation",
}

func GetImages() []string {
	v := make([]string, 0, len(JobToImage))

	for _, value := range JobToImage {
		v = append(v, value)
	}
	return v
}
