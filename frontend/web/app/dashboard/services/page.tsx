"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import DashboardPageWrapper from "@/layouts/dashboard/DashboardPageWrapper";
import { servicesAtom } from "@/stores";
import services from "@/services";
import { Area, Service } from "@/types/services";

const ServiceLine = ({
	service,
	selectedServiceId,
	setSelectedServiceId,
}: {
	service: Service;
	selectedServiceId: string | null;
	setSelectedServiceId: (serviceId: string | null) => void;
}) => {
	const [actions, setActions] = useState<Area[]>([]);
	const [reactions, setReactions] = useState<Area[]>([]);
	const { t } = useTranslation();

	useEffect(() => {
		(async () => {
			const actionsResponse = await services.services.getServiceActions(service.id);
			const reactionsResponse = await services.services.getServiceReactions(service.id);

			setActions(actionsResponse.data ?? []);
			setReactions(reactionsResponse.data ?? []);
		})();
	}, []);

	return (
		<div className="collapse collapse-arrow">
			<input
				type="radio"
				checked={selectedServiceId === service.id}
				onChange={() => setSelectedServiceId(service.id)}
			/>

			<div className="m-2 collapse-title text-2xl font-medium flex bg-neutral rounded-lg w-full">
				<div className="avatar">
					<div className="mask mask-squircle w-8 h-8">
						<Image src={service.imageUrl} alt="Service logo" width={500} height={500} />
					</div>
				</div>
				<p className="ml-2">{service.id}</p>
			</div>
			<div className="collapse-content">
				{actions.length > 0 && (
					<>
						<p className="font-semibold text-xl">{t("services.actions")}</p>
						<ul className="list-disc ml-8">
							{actions.map((action) => (
								<li className="list-item" key={action.id}>
									<p className="text-md font-medium">{action.id}</p>
									<p className="text-sm">{action.description}</p>
								</li>
							))}
						</ul>
					</>
				)}
				{reactions.length > 0 && (
					<>
						<p className="font-semibold text-xl">{t("services.reactions")}</p>
						<ul className="list-disc ml-8">
							{reactions.map((reaction) => (
								<li className="list-item" key={reaction.id}>
									<p className="text-md font-medium">{reaction.id}</p>
									<p className="text-sm">{reaction.description}</p>
								</li>
							))}
						</ul>
					</>
				)}

				{actions.length === 0 && reactions.length === 0 && (
					<p className="font-semibold text-md">{t("services.noArea")}</p>
				)}
			</div>
		</div>
	);
};

const ServicesPage = () => {
	const [, setCachedServices] = useAtom(servicesAtom);
	const [displayedServices, setDisplayedServices] = useState<Service[]>([]);
	const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
	const { t } = useTranslation();

	useEffect(() => {
		(async () => {
			const fetchedServices = await services.services.getAll();
			const result = fetchedServices.data ?? [];
			setCachedServices(result);
			setDisplayedServices(result);
		})();
	}, []);

	return (
		<DashboardPageWrapper title={t("services.title")}>
			{displayedServices.map((service) => (
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
