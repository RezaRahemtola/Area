"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Area } from "@/types/services";
import EditorStepCardWrapper from "@/components/editor/EditorStepCardWrapper";
import { EditorCardActions } from "@/types/editor";
import { EditorWorkflowAction, EditorWorkflowReaction } from "@/types/workflows";
import services from "@/services";

type EditorSelectEventAndAccountProps = {
	workflowArea: EditorWorkflowAction | EditorWorkflowReaction;
	areaChoices: Area[];
	title: string;
	actions: EditorCardActions;
	onEvent: (type: "back" | "next", area?: Area) => void;
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
						onChange={(e) => setSelectedEventId(e.target.value)}
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
							<span>Account already connected</span>
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
						onClick={() =>
							onEvent(
								"next",
								areaChoices.find((c) => c.id === selectedEventId),
							)
						}
					>
						Next
					</button>
				</div>
			</>
		</EditorStepCardWrapper>
	);
};

export default EditorSelectEventAndAccount;
