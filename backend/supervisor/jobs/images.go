package jobs

var JobToImage = map[string]string{
	"timer-seconds-interval": "supervisor-seconds-interval",
	"google-send-email":      "supervisor-gmail",
}

var OptArgument = map[string]string{
	"timer-seconds-interval": "",
	"google-send-email":      "send-email",
}

func GetImages() []string {
	v := make([]string, 0, len(JobToImage))

	for _, value := range JobToImage {
		v = append(v, value)
	}
	return v
}
