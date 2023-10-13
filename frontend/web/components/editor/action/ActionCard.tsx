"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { editorActionServices, editorWorkflowAtom, selectedEditorAreaAtom } from "@/stores/editor";
import EditorSummaryCard from "@/components/editor/EditorSummaryCard";
import EditorSelectServiceCard from "@/layouts/editor/EditorSelectServiceCard";
import EditorSelectEventAndAccount from "@/layouts/editor/EditorSelectEventAndAccount";
import { Area, Service } from "@/types/services";
import services from "@/services";
import { EditorWorkflowElementArea } from "@/types/workflows";

enum Step {
	SUMMARY = 0,
	SELECT_SERVICE = 1,
	SELECT_EVENT_AND_ACCOUNT = 2,
}

const ActionCard = () => {
	const [{ action }, setWorkflow] = useAtom(editorWorkflowAtom);
	const [selectedArea, setSelectedArea] = useAtom(selectedEditorAreaAtom);
	const [step, setStep] = useState<Step>(Step.SUMMARY);
	const [availableActions, setAvailableActions] = useState<Area[]>([]);
	const [availableServices, setAvailableServices] = useAtom(editorActionServices);
	const { t } = useTranslation();

	useEffect(() => {
		(async () => {
			if (action.areaService === undefined) {
				setAvailableActions([]);
				return;
			}
			const fetchedActions = await services.services.getServiceActions(action.areaService.id);
			setAvailableActions(fetchedActions.data ?? []);
		})();
	}, [action.areaService]);

	useEffect(() => {
		(async () => {
			if (availableServices.length !== 0) {
				return;
			}
			const fetchedServices = await services.services.getAll("actions");
			setAvailableServices(fetchedServices.data ?? []);
		})();
	}, []);

	const onSummaryClick = () => {
		if (step === Step.SUMMARY) {
			setStep(Step.SELECT_SERVICE);
		}
		setSelectedArea(action.id);
	};
	const onSelectServiceClick = (service: Service) => {
		setWorkflow((prev) => ({
			...prev,
			action: { ...prev.action, area: undefined, areaService: service },
		}));
		setStep(Step.SELECT_EVENT_AND_ACCOUNT);
	};

	const onSelectEventAndAccount = (type: "back" | "next", area?: EditorWorkflowElementArea) => {
		setWorkflow((prev) => ({
			...prev,
			action: { ...prev.action, area },
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
				title={t("editor.action.title")}
				description={action.area ? action.area.id : t("editor.action.description")}
				icon="bolt"
				onClick={onSummaryClick}
				service={action.areaService}
			/>
		);
	}
	if (step === Step.SELECT_SERVICE)
		return (
			<EditorSelectServiceCard
				title={t("editor.action.title")}
				actions={{ enabled: false }}
				currentService={action.areaService}
				serviceChoices={availableServices}
				onNextStep={onSelectServiceClick}
			/>
		);
	if (step === Step.SELECT_EVENT_AND_ACCOUNT)
		return (
			<EditorSelectEventAndAccount
				title={t("editor.action.title")}
				actions={{ enabled: false }}
				workflowArea={action}
				areaChoices={availableActions}
				onEvent={onSelectEventAndAccount}
			/>
		);
	return <></>;
};

export default ActionCard;
