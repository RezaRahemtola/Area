"use client";

import { useState } from "react";
import Image from "next/image";

import { Area } from "@/types/services";
import EditorStepCardWrapper from "@/components/editor/EditorStepCardWrapper";
import { EditorCardActions } from "@/types/editor";
import { EditorWorkflowAction, EditorWorkflowReaction } from "@/types/workflows";

const options: Area[] = [
	{
		id: "New message received",
		serviceScopesNeeded: [],
	},
	{
		id: "New calendar event received",
		serviceScopesNeeded: [],
	},
];

type EditorSelectEventAndAccountProps = {
	area: EditorWorkflowAction | EditorWorkflowReaction;
	title: string;
	actions: EditorCardActions;
	onEvent: (type: "back" | "next", area?: Area) => void;
};

const EditorSelectEventAndAccount = ({ area, title, actions, onEvent }: EditorSelectEventAndAccountProps) => {
	const [selectedEventId, setSelectedEventId] = useState<string | undefined>(area.area?.id);
	const [selectedAccount, setSelectedAccount] = useState<boolean>(false);

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
						{options.map((event) => (
							<option value={event.id} key={event.id}>
								{event.id}
							</option>
						))}
					</select>
				</div>

				<label className="label">
					<span className="label-text text-neutral-content">Choose your account</span>
				</label>
				<button className="btn btn-ghost w-16 h-16">
					<div className="avatar m-auto" onClick={() => setSelectedAccount(true)}>
						<div className="mask mask-squircle w-16 h-16">
							<Image src={area.areaService!.imageUrl} alt="Service logo" width={300} height={300} />
						</div>
					</div>
				</button>

				<div className="card-actions">
					<button
						className="btn btn-outline btn-neutral text-neutral-content hover:text-neutral-content"
						onClick={() => onEvent("back")}
					>
						Back
					</button>
					<button
						className="btn btn-primary btn-wide disabled:bg-accent"
						disabled={!selectedEventId || !selectedAccount}
						onClick={() =>
							onEvent(
								"next",
								options.find((o) => o.id === selectedEventId)
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
