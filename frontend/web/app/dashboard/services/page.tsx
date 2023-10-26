"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import Image from "next/image";
import DashboardPageWrapper from "@/layouts/dashboard/DashboardPageWrapper";
import { servicesAtom } from "@/stores";
import services from "@/services";
import { Service } from "@/types/services";

const ServiceLine = ({
	service,
	selectedServiceId,
	setSelectedServiceId,
}: {
	service: Service;
	selectedServiceId: string | null;
	setSelectedServiceId: (serviceId: string | null) => void;
}) => (
	<div className="collapse collapse-arrow">
		<input type="radio" checked={selectedServiceId === service.id} onChange={() => setSelectedServiceId(service.id)} />

		<div className="collapse-title text-xl font-medium flex">
			<div className="avatar">
				<div className="mask mask-squircle w-8 h-8">
					<Image src={service.imageUrl} alt="Service logo" width={500} height={500} />
				</div>
			</div>
			<p className="ml-2">{service.id}</p>
		</div>
		<div className="collapse-content">
			<p>TODO: Actions and Reactions displayed</p>
		</div>
	</div>
);

const ServicesPage = () => {
	const [cachedServices, setCachedServices] = useAtom(servicesAtom);
	const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			const fetchedServices = await services.services.getAll();
			setCachedServices(fetchedServices.data ?? []);
		})();
	}, []);

	return (
		<DashboardPageWrapper title="Services">
			{cachedServices.map((service) => (
				<ServiceLine
					service={service}
					selectedServiceId={selectedServiceId}
					setSelectedServiceId={setSelectedServiceId}
					key={service.id}
				/>
			))}
		</DashboardPageWrapper>
	);
};

export default ServicesPage;
