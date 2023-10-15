const formatApiErrorMessage = (message: string | string[]) => {
	if (Array.isArray(message)) return message.join("\n");
	return message;
};

export default formatApiErrorMessage;
