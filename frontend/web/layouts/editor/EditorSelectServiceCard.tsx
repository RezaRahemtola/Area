import { useState } from "react";
import { Service } from "@/types/services";
import ServicesList from "@/components/editor/ServicesList";
import EditorStepCardWrapper from "@/components/editor/EditorStepCardWrapper";
import { EditorCardActions } from "@/types/editor";
import { EditorWorkflowElementService } from "@/types/workflows";

type EditorSelectServiceCardProps = {
	title: string;
	actions: EditorCardActions;
	currentService?: EditorWorkflowElementService;
	serviceChoices: Service[];
	onNextStep: (service: Service) => void;
};
const EditorSelectServiceCard = ({
	title,
	actions,
	currentService,
	serviceChoices,
	onNextStep,
}: EditorSelectServiceCardProps) => {
	const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(currentService?.id);

	return (
		<EditorStepCardWrapper title={title} actions={actions}>
			<ServicesList
				services={serviceChoices}
				nbPerLine={3}
				selectedServiceId={selectedServiceId}
				setSelectedService={setSelectedServiceId}
			/>

			<div className="card-actions">
				<button
					className="btn btn-primary btn-wide disabled:bg-accent"
					disabled={!selectedServiceId}
					onClick={() => onNextStep(serviceChoices.find((s) => s.id === selectedServiceId)!)}
				>
					Next
				</button>
			</div>
		</EditorStepCardWrapper>
	);
};

export default EditorSelectServiceCard;
