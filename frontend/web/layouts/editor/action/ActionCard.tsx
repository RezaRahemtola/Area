"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { editorWorkflowAtom, selectedEditorArea } from "@/stores/editor";
import ActionSummaryCard from "@/layouts/editor/action/ActionSummaryCard";
import ActionSelectServiceCard from "@/layouts/editor/action/ActionSelectServiceCard";
import { EditorElement } from "@/types/workflows";

enum ActionStep {
	SUMMARY = 0,
	SELECT_SERVICE = 1,
}

const ActionCard = ({ action }: { action: EditorElement }) => {
	const [workflow] = useAtom(editorWorkflowAtom);
	const [selectedArea, setSelectedArea] = useAtom(selectedEditorArea);
	const [step, setStep] = useState<ActionStep>(ActionStep.SUMMARY);

	const onSummaryClick = () => {
		setStep(ActionStep.SELECT_SERVICE);
		setSelectedArea(workflow.action.id);
	};

	if (step === ActionStep.SUMMARY || selectedArea !== workflow.action.id)
		return <ActionSummaryCard onClick={onSummaryClick} service={action.service} />;
	if (step === ActionStep.SELECT_SERVICE) return <ActionSelectServiceCard />;

	return <></>;
};

export default ActionCard;
