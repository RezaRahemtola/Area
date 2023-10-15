package jobs

var JobToImage = map[string]string{
	"timer-seconds-interval":        "supervisor-seconds-interval",
	"google-send-email":             "supervisor-google",
	"google-create-draft-email":     "supervisor-google",
	"google-update-signature-email": "supervisor-google",
	"google-create-comment-youtube": "supervisor-google",
}

var OptArgument = map[string]string{
	"timer-seconds-interval":        "",
	"google-send-email":             "send-email",
	"google-create-draft-email":     "create-draft-email",
	"google-update-signature-email": "update-signature-email",
	"google-create-comment-youtube": "create-comment-youtube",
}

func GetImages() []string {
	v := make([]string, 0, len(JobToImage))

	for _, value := range JobToImage {
		v = append(v, value)
	}
	return v
}
