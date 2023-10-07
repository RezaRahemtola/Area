"use client";

import { useAtom } from "jotai";
import { useState } from "react";

import { editorWorkflowAtom, selectedEditorAreaAtom } from "@/stores/editor";
import EditorSummaryCard from "@/components/editor/EditorSummaryCard";
import { Area, Service } from "@/types/services";
import EditorSelectServiceCard from "@/layouts/editor/EditorSelectServiceCard";
import EditorSelectEventAndAccount from "@/layouts/editor/EditorSelectEventAndAccount";

enum Step {
	SUMMARY = 0,
	SELECT_SERVICE = 1,
	SELECT_EVENT_AND_ACCOUNT = 2,
}

const ActionCard = () => {
	const [{ action }, setWorkflow] = useAtom(editorWorkflowAtom);
	const [selectedArea, setSelectedArea] = useAtom(selectedEditorAreaAtom);
	const [step, setStep] = useState<Step>(Step.SUMMARY);

	const onSummaryClick = () => {
		if (step === Step.SUMMARY) {
			setStep(Step.SELECT_SERVICE);
		}
		setSelectedArea(action.id);
	};
	const onSelectServiceClick = (service: Service) => {
		setWorkflow((prev) => ({
			...prev,
			action: { ...prev.action, service, event: undefined },
		}));
		setStep(Step.SELECT_EVENT_AND_ACCOUNT);
	};

	const onSelectEventAndAccount = (type: "back" | "next", event?: Area, account: boolean = false) => {
		setWorkflow((prev) => ({
			...prev,
			action: { ...prev.action, event, account },
		}));

		if (type === "next") {
			setSelectedArea(null);
		} else {
			setStep(Step.SELECT_SERVICE);
		}
	};

	if (step === Step.SUMMARY || selectedArea !== action.id) {
		return (
			<EditorSummaryCard
				title="Action"
				description={action.event ? action.event.name : "An event that starts your workflow"}
				icon="bolt"
				onClick={onSummaryClick}
				service={action.service}
			/>
		);
	}
	if (step === Step.SELECT_SERVICE)
		return (
			<EditorSelectServiceCard
				title="Action"
				actions={{ enabled: false }}
				currentService={action.service}
				onNextStep={onSelectServiceClick}
			/>
		);
	if (step === Step.SELECT_EVENT_AND_ACCOUNT)
		return (
			<EditorSelectEventAndAccount
				title="Action"
				actions={{ enabled: false }}
				area={action}
				onEvent={onSelectEventAndAccount}
			/>
		);
	return <></>;
};

export default ActionCard;
