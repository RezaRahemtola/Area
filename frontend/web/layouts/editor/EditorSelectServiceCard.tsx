import { useState } from "react";
import { Service } from "@/types/services";
import ServicesList from "@/components/editor/ServicesList";
import EditorStepCardWrapper from "@/components/editor/EditorStepCardWrapper";
import { EditorCardActions } from "@/types/editor";
import { EditorWorkflowElementService } from "@/types/workflows";

const services: Service[] = [
	{
		id: "Discord",
		imageUrl: "https://daisyui.com/tailwind-css-component-profile-2@56w.png",
		scopes: [],
		oauthUrl: "",
	},
	{
		id: "GitHub",
		imageUrl: "https://daisyui.com/tailwind-css-component-profile-3@56w.png",
		scopes: [],
		oauthUrl: "",
	},
	{
		id: "Google",
		imageUrl: "https://daisyui.com/tailwind-css-component-profile-4@56w.png",
		scopes: [],
		oauthUrl: "",
	},
	{
		id: "Twitter",
		imageUrl: "https://daisyui.com/tailwind-css-component-profile-5@56w.png",
		scopes: [],
		oauthUrl: "",
	},
];

type EditorSelectServiceCardProps = {
	title: string;
	actions: EditorCardActions;
	currentService?: EditorWorkflowElementService;
	onNextStep: (service: Service) => void;
};
const EditorSelectServiceCard = ({ title, actions, currentService, onNextStep }: EditorSelectServiceCardProps) => {
	const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(currentService?.id);

	return (
		<EditorStepCardWrapper title={title} actions={actions}>
			<ServicesList
				services={services}
				nbPerLine={3}
				selectedServiceId={selectedServiceId}
				setSelectedService={setSelectedServiceId}
			/>

			<div className="card-actions">
				<button
					className="btn btn-primary btn-wide disabled:bg-accent"
					disabled={!selectedServiceId}
					onClick={() => onNextStep(services.find((s) => s.id === selectedServiceId)!)}
				>
					Next
				</button>
			</div>
		</EditorStepCardWrapper>
	);
};

export default EditorSelectServiceCard;
