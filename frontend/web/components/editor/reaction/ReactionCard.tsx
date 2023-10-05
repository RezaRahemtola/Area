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

type ReactionCardProps = { reaction: EditorElement };
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
				if (r.id === reaction.id) return { ...r, service, event: undefined };
				return r;
			}),
		}));

		setStep(Step.SELECT_EVENT_AND_ACCOUNT);
	};

	const onSelectEventAndAccount = (type: "back" | "next", event?: Area, account: boolean = false) => {
		setWorkflow((prev) => ({
			...prev,
			reactions: prev.reactions.map((r) => {
				if (r.id === reaction.id)
					return {
						...r,
						event,
						account,
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

	if (step === Step.SUMMARY || selectedArea !== reaction.id) {
		return (
			<EditorSummaryCard
				title="Reaction"
				description={reaction.event ? reaction.event.name : "An event a workflow performs after it start"}
				icon="bolt"
				onClick={onSummaryClick}
				service={reaction.service}
			/>
		);
	}
	if (step === Step.SELECT_SERVICE)
		return (
			<EditorSelectServiceCard
				title="Reaction"
				actions={{
					enabled: true,
					onDeleteStep: () => {},
				}}
				currentService={reaction.service}
				onNextStep={onSelectServiceClick}
			/>
		);
	if (step === Step.SELECT_EVENT_AND_ACCOUNT)
		return (
			<EditorSelectEventAndAccount
				title="Reaction"
				actions={{
					enabled: true,
					onDeleteStep: () => {},
				}}
				area={reaction}
				onEvent={onSelectEventAndAccount}
			/>
		);
	return <></>;
};

export default EditorCard;
