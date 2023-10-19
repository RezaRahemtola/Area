"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { editorReactionServices, editorWorkflowAtom, selectedEditorAreaAtom } from "@/stores/editor";
import EditorSummaryCard from "@/components/editor/EditorSummaryCard";
import { Area, Service } from "@/types/services";
import EditorSelectServiceCard from "@/layouts/editor/EditorSelectServiceCard";
import EditorSelectEventAndAccount from "@/layouts/editor/EditorSelectEventAndAccount";
import { EditorCardActions } from "@/types/editor";
import { EditorWorkflowElementArea, EditorWorkflowReaction } from "@/types/workflows";
import services from "@/services";

enum Step {
	SUMMARY = 0,
	SELECT_SERVICE = 1,
	SELECT_EVENT_AND_ACCOUNT = 2,
}

type ReactionCardProps = { reaction: EditorWorkflowReaction };
const EditorCard = ({ reaction }: ReactionCardProps) => {
	const [workflow, setWorkflow] = useAtom(editorWorkflowAtom);
	const [selectedArea, setSelectedArea] = useAtom(selectedEditorAreaAtom);
	const [step, setStep] = useState<Step>(Step.SUMMARY);
	const [availableReactions, setAvailableReactions] = useState<Area[]>([]);
	const [availableServices, setAvailableServices] = useAtom(editorReactionServices);
	const { t } = useTranslation();

	useEffect(() => {
		(async () => {
			if (reaction.areaService === undefined) {
				setAvailableReactions([]);
				return;
			}
			const fetchedActions = await services.services.getServiceReactions(reaction.areaService.id);
			setAvailableReactions(fetchedActions.data ?? []);
		})();
	}, [reaction.areaService]);

	useEffect(() => {
		(async () => {
			if (availableServices.length !== 0) {
				return;
			}
			const fetchedServices = await services.services.getAll("reactions");
			setAvailableServices(fetchedServices.data ?? []);
		})();
	}, []);

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
	const onSelectEventAndAccount = (type: "back" | "next", area?: EditorWorkflowElementArea) => {
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
			const pointingToDeleted = workflow.reactions.filter((r) => r.previousAreaId === reaction.id).map((r) => r.id);
			const newReactions = workflow.reactions
				.map((r) => {
					if (pointingToDeleted.includes(r.id)) return { ...r, previousAreaId: reaction.previousAreaId };
					return r;
				})
				.filter((r) => r.id !== reaction.id);

			setWorkflow((prev) => ({ ...prev, reactions: newReactions }));
		},
	};

	if (step === Step.SUMMARY || selectedArea !== reaction.id) {
		return (
			<EditorSummaryCard
				title={t("editor.reaction.title")}
				description={reaction.area ? reaction.area.id : t("editor.reaction.description")}
				icon="bolt"
				onClick={onSummaryClick}
				service={reaction.areaService}
			/>
		);
	}
	if (step === Step.SELECT_SERVICE)
		return (
			<EditorSelectServiceCard
				title={t("editor.reaction.title")}
				actions={actions}
				currentService={reaction.areaService}
				serviceChoices={availableServices}
				onNextStep={onSelectServiceClick}
			/>
		);
	if (step === Step.SELECT_EVENT_AND_ACCOUNT)
		return (
			<EditorSelectEventAndAccount
				title={t("editor.reaction.title")}
				actions={actions}
				workflowArea={reaction}
				areaChoices={availableReactions}
				onEvent={onSelectEventAndAccount}
			/>
		);
	return <></>;
};

export default EditorCard;
