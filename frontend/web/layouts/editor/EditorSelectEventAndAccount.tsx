"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Area, AreaParameterWithValue } from "@/types/services";
import EditorStepCardWrapper from "@/components/editor/EditorStepCardWrapper";
import { EditorCardActions } from "@/types/editor";
import { EditorWorkflowAction, EditorWorkflowElementArea, EditorWorkflowReaction } from "@/types/workflows";
import services from "@/services";
import EditorAreParameter from "@/layouts/editor/EditorAreParameter";

type EditorSelectEventAndAccountProps = {
	workflowArea: EditorWorkflowAction | EditorWorkflowReaction;
	areaChoices: Area[];
	title: string;
	actions: EditorCardActions;
	onEvent: (type: "back" | "next", area?: EditorWorkflowElementArea) => void;
};

const EditorSelectEventAndAccount = ({
	workflowArea,
	areaChoices,
	title,
	actions,
	onEvent,
}: EditorSelectEventAndAccountProps) => {
	const [selectedEventId, setSelectedEventId] = useState<string | undefined>(workflowArea.area?.id);
	const [connectAccountUrl, setConnectAccountUrl] = useState<string | null>(null);
	const [accountConnectionInProgress, setAccountConnectionInProgress] = useState(false);
	const [selectedParameters, setSelectedParameters] = useState<AreaParameterWithValue[]>(
		workflowArea.area?.parameters ?? [],
	);

	useEffect(() => {
		(async () => {
			if (selectedEventId !== undefined) {
				const chosenArea = areaChoices.find((area) => area.id === selectedEventId)!;
				const connectService = await services.connections.connect(
					workflowArea.areaService!.id,
					chosenArea.serviceScopesNeeded,
				);
				setConnectAccountUrl(connectService.data ? connectService.data.oauthUrl : null);
			}
		})();
	}, [selectedEventId]);

	useEffect(() => {
		if (!accountConnectionInProgress) return () => {};
		const accountConnectionCheck = setInterval(() => {
			(async () => {
				const chosenArea = areaChoices.find((area) => area.id === selectedEventId)!;
				const connectService = await services.connections.connect(
					workflowArea.areaService!.id,
					chosenArea.serviceScopesNeeded,
				);

				if (connectService.data && connectService.data.oauthUrl === null) {
					setConnectAccountUrl(null);
					setAccountConnectionInProgress(false);
				}
			})();
		}, 1000);

		return () => {
			clearInterval(accountConnectionCheck);
		};
	}, [accountConnectionInProgress]);

	const onParamValueChange = (parameterName: string, value?: never) => {
		setSelectedParameters((prev) =>
			prev.map((param) => {
				if (param.name === parameterName) return { ...param, value };
				return param;
			}),
		);
	};

	const noAccountMessage = connectAccountUrl === "" ? "No account to connect" : "Account already connected";

	return (
		<EditorStepCardWrapper title={title} actions={actions}>
			<>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text text-neutral-content">Choose an event</span>
					</label>
					<select
						className="select select-bordered bg-neutral"
						value={selectedEventId ?? ""}
						onChange={(e) => {
							setSelectedEventId(e.target.value);
							setSelectedParameters(
								areaChoices.find((choice) => choice.id === e.target.value)?.parametersFormFlow ?? [],
							);
						}}
					>
						<option value={undefined} hidden>
							Pick one
						</option>
						{areaChoices.map((choice) => (
							<option value={choice.id} key={choice.id}>
								{choice.id}
							</option>
						))}
					</select>
				</div>

				{selectedEventId && (
					<>
						{selectedParameters.length > 0 && (
							<>
								<label className="label">
									<span className="label-text text-neutral-content">Parameters</span>
								</label>
								{selectedParameters.map((param) => (
									<EditorAreParameter key={param.name} parameter={param} onValueChange={onParamValueChange} />
								))}
							</>
						)}

						<label className="label">
							<span className="label-text text-neutral-content">Connect your account</span>
						</label>
						{connectAccountUrl ? (
							<button className="btn btn-ghost w-16 h-16">
								<a href={connectAccountUrl} target="_blank" onClick={() => setAccountConnectionInProgress(true)}>
									<div className="avatar m-auto">
										<div className="mask mask-squircle w-16 h-16">
											<Image src={workflowArea.areaService!.imageUrl} alt="Service logo" width={300} height={300} />
										</div>
									</div>
								</a>
							</button>
						) : (
							<span>{noAccountMessage}</span>
						)}
					</>
				)}

				<div className="card-actions">
					<button
						className="btn btn-outline btn-neutral text-neutral-content hover:text-neutral-content"
						onClick={() => onEvent("back")}
					>
						Back
					</button>
					<button
						className="btn btn-primary btn-wide disabled:bg-accent"
						disabled={!selectedEventId}
						onClick={() => onEvent("next", { id: selectedEventId!, parameters: selectedParameters })}
					>
						Next
					</button>
				</div>
			</>
		</EditorStepCardWrapper>
	);
};

export default EditorSelectEventAndAccount;
