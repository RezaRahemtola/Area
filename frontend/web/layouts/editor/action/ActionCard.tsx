"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { editorWorkflowAtom, selectedEditorAreaAtom } from "@/stores/editor";
import ActionSummaryCard from "@/layouts/editor/action/ActionSummaryCard";
import ActionSelectServiceCard from "@/layouts/editor/action/ActionSelectServiceCard";
import { EditorElement } from "@/types/workflows";
import ActionSelectEventAndAccount from "@/layouts/editor/action/ActionSelectEventAndAccount";

enum ActionStep {
	SUMMARY = 0,
	SELECT_SERVICE = 1,
	SELECT_EVENT_AND_ACCOUNT = 2,
}

const ActionCard = ({ action }: { action: EditorElement }) => {
	const [workflow] = useAtom(editorWorkflowAtom);
	const [selectedArea, setSelectedArea] = useAtom(selectedEditorAreaAtom);
	const [step, setStep] = useState<ActionStep>(ActionStep.SUMMARY);

	const onSummaryClick = () => {
		if (step === ActionStep.SUMMARY) {
			setStep(ActionStep.SELECT_SERVICE);
		}
		setSelectedArea(workflow.action.id);
	};

	if (step === ActionStep.SUMMARY || selectedArea !== workflow.action.id)
		return <ActionSummaryCard onClick={onSummaryClick} action={action} />;
	if (step === ActionStep.SELECT_SERVICE)
		return <ActionSelectServiceCard onNextStep={() => setStep(ActionStep.SELECT_EVENT_AND_ACCOUNT)} />;
	if (step === ActionStep.SELECT_EVENT_AND_ACCOUNT)
		return <ActionSelectEventAndAccount onNextStep={() => setSelectedArea(null)} />;
};

export default ActionCard;
