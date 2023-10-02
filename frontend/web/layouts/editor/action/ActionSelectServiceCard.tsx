import Image from "next/image";
import { useAtom } from "jotai";
import { useState } from "react";

import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import { editorWorkflowAtom } from "@/stores/editor";
import { Service } from "@/types/services";
import { splitArrayInChunks } from "@/utils/arrays";

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

const ActionServiceElement = ({
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
const ActionSelectServiceCard = () => {
	const [workflow, setWorkflow] = useAtom(editorWorkflowAtom);
	const [selectedService, setSelectedService] = useState<Service | undefined>(workflow.action.service);

	const servicesChunks = splitArrayInChunks(services, 3);

	const onServiceSave = () => {
		setWorkflow((prev) => ({ ...prev, action: { ...prev.action, service: selectedService!, event: undefined } }));
	};

	return (
		<div className="card mx-auto w-2/3 shadow-2xl">
			<div className="card-body items-center pt-3">
				<div className="flex mb-5">
					<FontAwesomeIcon icon="bolt" svgProps={{ className: "h-7 w-7" }} />
					<p className="card-title text-2xl ml-2">Action</p>
				</div>

				{servicesChunks.map((chunk, index) => (
					<div className="flex w-full justify-around my-2" key={index}>
						{chunk.map((service) => (
							<ActionServiceElement
								service={service}
								onClick={() => setSelectedService(service)}
								key={service.id}
								selected={selectedService?.id === service.id}
							/>
						))}
					</div>
				))}

				<div className="card-actions">
					<button
						className="btn btn-primary btn-wide disabled:bg-accent"
						disabled={!selectedService}
						onClick={onServiceSave}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default ActionSelectServiceCard;
