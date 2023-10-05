"use client";

import { useAtom } from "jotai";
import { useState } from "react";

import { editorWorkflowAtom, selectedEditorAreaAtom } from "@/stores/editor";
import { EditorElement } from "@/types/workflows";
import EditorSummaryCard from "@/components/editor/EditorSummaryCard";
import { Area, Service } from "@/types/services";
import EditorSelectServiceCard from "@/layouts/editor/EditorSelectServiceCard";
import EditorSelectEventAndAccount from "@/layouts/editor/EditorSelectEventAndAccount";

enum Step {
	SUMMARY = 0,
	SELECT_SERVICE = 1,
	SELECT_EVENT_AND_ACCOUNT = 2,
}

const EditorCard = ({ area, isAction }: { area: EditorElement; isAction: boolean }) => {
	const [workflow, setWorkflow] = useAtom(editorWorkflowAtom);
	const [selectedArea, setSelectedArea] = useAtom(selectedEditorAreaAtom);
	const [step, setStep] = useState<Step>(Step.SUMMARY);

	const currentService = isAction
		? workflow.action.service
		: workflow.reactions.find((reaction) => reaction.id === area.id)?.service;

	const onSummaryClick = () => {
		if (step === Step.SUMMARY) {
			setStep(Step.SELECT_SERVICE);
		}
		setSelectedArea(area.id);
	};
	const onSelectServiceClick = (service: Service) => {
		if (isAction) {
			setWorkflow((prev) => ({ ...prev, action: { ...prev.action, service, event: undefined } }));
		} else {
			setWorkflow((prev) => ({
				...prev,
				reactions: prev.reactions.map((reaction) => {
					if (reaction.id === area.id) return { ...reaction, service, event: undefined };
					return reaction;
				}),
			}));
		}
		setStep(Step.SELECT_EVENT_AND_ACCOUNT);
	};

	const onSelectEventAndAccount = (type: "back" | "next", event?: Area, account: boolean = false) => {
		if (isAction) {
			setWorkflow((prev) => ({
				...prev,
				action: {
					...prev.action,
					event,
					account,
				},
			}));
		} else {
			setWorkflow((prev) => ({
				...prev,
				reactions: prev.reactions.map((reaction) => {
					if (reaction.id === area.id)
						return {
							...reaction,
							event,
							account,
						};
					return reaction;
				}),
			}));
		}
		if (type === "next") {
			setSelectedArea(null);
		} else {
			setStep(Step.SELECT_SERVICE);
		}
	};

	if (step === Step.SUMMARY || selectedArea !== area.id) {
		const defaultDescription = isAction
			? "An event that starts your workflow"
			: "An event a workflow performs after it start";

		return (
			<EditorSummaryCard
				title={isAction ? "Action" : "Reaction"}
				description={area.event ? area.event.name : defaultDescription}
				icon="bolt"
				onClick={onSummaryClick}
				service={area.service}
			/>
		);
	}
	if (step === Step.SELECT_SERVICE)
		return (
			<EditorSelectServiceCard isAction={isAction} currentService={currentService} onNextStep={onSelectServiceClick} />
		);
	if (step === Step.SELECT_EVENT_AND_ACCOUNT)
		return <EditorSelectEventAndAccount isAction={isAction} area={area} onEvent={onSelectEventAndAccount} />;
	return <></>;
};

export default EditorCard;
