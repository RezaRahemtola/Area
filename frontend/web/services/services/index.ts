import { getAll, getOne } from "@/services/services/services";
import { getServiceActions, getServiceReactions } from "@/services/services/areas";

const servicesService = {
	getAll,
	getOne,
	getServiceActions,
	getServiceReactions,
};

export default servicesService;
