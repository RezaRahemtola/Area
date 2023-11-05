import { deleteBulk, deleteOne } from "@/services/workflows/delete";
import { toggleBulk, toggleOne } from "@/services/workflows/update";
import { create, rename, update } from "@/services/workflows/editor";
import { getAll, getOne } from "@/services/workflows/get";
import getActivities from "@/services/workflows/activity";

const workflowsService = {
	toggleOne,
	toggleBulk,
	deleteOne,
	deleteBulk,
	create,
	update,
	rename,
	getOne,
	getAll,
	getActivities,
};

export default workflowsService;
