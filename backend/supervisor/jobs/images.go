package jobs

var JobToImage = map[string]string{
	"timer-seconds-interval": "supervisor-seconds-interval",
	"google-send-email":      "supervisor-gmail",
	"google-create-draft-email":      "supervisor-gmail",
}

var OptArgument = map[string]string{
	"timer-seconds-interval": "",
	"google-send-email":      "send-email",
	"google-create-draft-email":      "create-draft-email",
}

func GetImages() []string {
	v := make([]string, 0, len(JobToImage))

	for _, value := range JobToImage {
		v = append(v, value)
	}
	return v
}
