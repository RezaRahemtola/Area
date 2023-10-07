"use client";

import { useAtom } from "jotai";
import { useState } from "react";

import { editorWorkflowAtom, selectedEditorAreaAtom } from "@/stores/editor";
import EditorSummaryCard from "@/components/editor/EditorSummaryCard";
import { Area, Service } from "@/types/services";
import EditorSelectServiceCard from "@/layouts/editor/EditorSelectServiceCard";
import EditorSelectEventAndAccount from "@/layouts/editor/EditorSelectEventAndAccount";
import { EditorCardActions } from "@/types/editor";
import { EditorWorkflowReaction } from "@/types/workflows";

enum Step {
	SUMMARY = 0,
	SELECT_SERVICE = 1,
	SELECT_EVENT_AND_ACCOUNT = 2,
}

type ReactionCardProps = { reaction: EditorWorkflowReaction };
const EditorCard = ({ reaction }: ReactionCardProps) => {
	const [, setWorkflow] = useAtom(editorWorkflowAtom);
	const [selectedArea, setSelectedArea] = useAtom(selectedEditorAreaAtom);
	const [step, setStep] = useState<Step>(Step.SUMMARY);

	const onSummaryClick = () => {
		if (step === Step.SUMMARY) {
			setStep(Step.SELECT_SERVICE);
		}
		setSelectedArea(reaction.id);
	};
	const onSelectServiceClick = (service: Service) => {
		setWorkflow((prev) => ({
			...prev,
			reactions: prev.reactions.map((r) => {
				if (r.id === reaction.id) return { ...r, areaService: service, area: undefined };
				return r;
			}),
		}));

		setStep(Step.SELECT_EVENT_AND_ACCOUNT);
	};
	const onSelectEventAndAccount = (type: "back" | "next", area?: Area) => {
		setWorkflow((prev) => ({
			...prev,
			reactions: prev.reactions.map((r) => {
				if (r.id === reaction.id)
					return {
						...r,
						area,
					};
				return r;
			}),
		}));

		if (type === "next") {
			setSelectedArea(null);
		} else {
			setStep(Step.SELECT_SERVICE);
		}
	};

	const actions: EditorCardActions = {
		enabled: true,
		onDeleteStep: () => {
			setWorkflow((prev) => ({ ...prev, reactions: prev.reactions.filter((r) => r.id !== reaction.id) }));
		},
	};

	if (step === Step.SUMMARY || selectedArea !== reaction.id) {
		return (
			<EditorSummaryCard
				title="Reaction"
				description={reaction.area ? reaction.area.id : "An event a workflow performs after it start"}
				icon="bolt"
				onClick={onSummaryClick}
				service={reaction.areaService}
			/>
		);
	}
	if (step === Step.SELECT_SERVICE)
		return (
			<EditorSelectServiceCard
				title="Reaction"
				actions={actions}
				currentService={reaction.areaService}
				onNextStep={onSelectServiceClick}
			/>
		);
	if (step === Step.SELECT_EVENT_AND_ACCOUNT)
		return (
			<EditorSelectEventAndAccount
				title="Reaction"
				actions={actions}
				area={reaction}
				onEvent={onSelectEventAndAccount}
			/>
		);
	return <></>;
};

export default EditorCard;
