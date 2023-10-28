import { deleteBulk, deleteOne } from "@/services/workflows/delete";
import { toggleBulk, toggleOne } from "@/services/workflows/update";
import { create, rename, update } from "@/services/workflows/editor";
import { getAll, getOne } from "@/services/workflows/get";

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
};

export default workflowsService;
