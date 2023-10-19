package jobs

var JobToImage = map[string]string{
	"timer-seconds-interval":            "supervisor-seconds-interval",
	"google-send-email":                 "supervisor-google",
	"google-create-draft-email":         "supervisor-google",
	"google-update-signature-email":     "supervisor-google",
	"google-create-comment-youtube":     "supervisor-google",
	"google-create-document-docs":       "supervisor-google",
	"google-create-presentation-slides": "supervisor-google",
	"google-create-spreadsheet":         "supervisor-google",
	"google-create-form":                "supervisor-google",
	"google-create-contact":             "supervisor-google",
	"linkedin-create-post":              "supervisor-linkedin",
	"google-create-task-list":           "supervisor-google",
}

var OptArgument = map[string]string{
	"timer-seconds-interval":            "",
	"google-send-email":                 "send-email",
	"google-create-draft-email":         "create-draft-email",
	"google-update-signature-email":     "update-signature-email",
	"google-create-comment-youtube":     "create-comment-youtube",
	"google-create-document-docs":       "create-document-docs",
	"google-create-presentation-slides": "create-presentation-slides",
	"google-create-spreadsheet":         "create-spreadsheet",
	"google-create-form":                "create-form",
	"google-create-contact":             "create-contact",
	"linkedin-create-post":              "create-post",
	"google-create-task-list":           "create-task-list",
}

func GetImages() []string {
	v := make([]string, 0, len(JobToImage))

	for _, value := range JobToImage {
		v = append(v, value)
	}
	return v
}
