import Image from "next/image";
import { useState } from "react";
import { Service } from "@/types/services";
import ServicesList from "@/components/editor/ServicesList";
import EditorStepCardWrapper from "@/components/editor/EditorStepCardWrapper";

const services: Service[] = [
	{
		id: "1",
		name: "Discord",
		imageUrl: "https://daisyui.com/tailwind-css-component-profile-2@56w.png",
		scopes: [],
	},
	{
		id: "2",
		name: "GitHub",
		imageUrl: "https://daisyui.com/tailwind-css-component-profile-3@56w.png",
		scopes: [],
	},
	{
		id: "3",
		name: "Google",
		imageUrl: "https://daisyui.com/tailwind-css-component-profile-4@56w.png",
		scopes: [],
	},
	{
		id: "4",
		name: "Twitter",
		imageUrl: "https://daisyui.com/tailwind-css-component-profile-5@56w.png",
		scopes: [],
	},
];

const ServiceElement = ({
	service,
	onClick,
	selected,
}: {
	service: Service;
	onClick: (service: Service) => void;
	selected: boolean;
}) => (
	<button className={`btn normal-case ${selected ? "btn-secondary" : "btn-ghost"}`} onClick={() => onClick(service)}>
		<div className="flex">
			<div className="avatar">
				<div className="mask mask-squircle w-8 h-8">
					<Image src={service.imageUrl} alt="Service logo" width={500} height={500} />
				</div>
			</div>
			<p className="text-xl font-semibold ml-2">{service.name}</p>
		</div>
	</button>
);

type EditorSelectServiceCardProps = {
	title: string;
	actions: { enabled: true; onDeleteStep: () => void } | { enabled: false };
	currentService?: Service;
	onNextStep: (service: Service) => void;
};
const EditorSelectServiceCard = ({ title, actions, currentService, onNextStep }: EditorSelectServiceCardProps) => {
	const [selectedService, setSelectedService] = useState<Service | undefined>(currentService);

	return (
		<EditorStepCardWrapper title={title} actions={actions}>
			<ServicesList
				services={services}
				nbPerLine={3}
				selectedServiceId={selectedService?.id}
				setSelectedService={setSelectedService}
			/>

			<div className="card-actions">
				<button
					className="btn btn-primary btn-wide disabled:bg-accent"
					disabled={!selectedService}
					onClick={() => onNextStep(selectedService!)}
				>
					Next
				</button>
			</div>
		</EditorStepCardWrapper>
	);
};

export default EditorSelectServiceCard;
