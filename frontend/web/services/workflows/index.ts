import { deleteBulk, deleteOne } from "@/services/workflows/delete";
import { toggleBulk, toggleOne } from "@/services/workflows/update";

const workflowsService = {
	toggleOne,
	toggleBulk,
	deleteOne,
	deleteBulk,
};

export default workflowsService;
