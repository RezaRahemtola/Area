"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import DashboardPageWrapper from "@/layouts/dashboard/DashboardPageWrapper";
import { servicesAtom } from "@/stores";
import services from "@/services";
import ServicesList from "@/components/editor/ServicesList";

const ServicesPage = () => {
	const [cachedServices, setCachedServices] = useAtom(servicesAtom);

	useEffect(() => {
		(async () => {
			const fetchedServices = await services.services.getAll();
			setCachedServices(fetchedServices.data ?? []);
		})();
	}, []);

	return (
		<DashboardPageWrapper title="Services">
			<ServicesList services={cachedServices} nbPerLine={1} />
		</DashboardPageWrapper>
	);
};

export default ServicesPage;
