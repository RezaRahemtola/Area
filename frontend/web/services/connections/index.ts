import { connect } from "@/services/connections/connect";
import authenticate from "@/services/connections/authenticate";

const connectionsService = {
	connect,
	authenticate,
};

export default connectionsService;
