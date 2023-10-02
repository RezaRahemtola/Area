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
	const [, setWorkflow] = useAtom(editorWorkflowAtom);
	const [selectedArea, setSelectedArea] = useAtom(selectedEditorAreaAtom);
	const [step, setStep] = useState<Step>(Step.SUMMARY);

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

	const onSelectEventAndAccountClick = (event: Area, account: boolean) => {
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
		setSelectedArea(null);
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
	if (step === Step.SELECT_SERVICE) return <EditorSelectServiceCard onNextStep={onSelectServiceClick} />;
	if (step === Step.SELECT_EVENT_AND_ACCOUNT)
		return <EditorSelectEventAndAccount area={area} onNextStep={onSelectEventAndAccountClick} />;
	return <></>;
};

export default EditorCard;
