"use client";

import { useState } from "react";
import Image from "next/image";

import { Area } from "@/types/services";
import { EditorElement } from "@/types/workflows";
import EditorStepCardWrapper from "@/components/editor/EditorStepCardWrapper";

const options: Area[] = [
	{
		id: "1",
		name: "New message received",
		serviceScopesNeeded: [],
	},
	{
		id: "2",
		name: "New calendar event received",
		serviceScopesNeeded: [],
	},
];

type EditorSelectEventAndAccountProps = {
	area: EditorElement;
	title: string;
	actions: { enabled: true; onDeleteStep: () => void } | { enabled: false };
	onEvent: (type: "back" | "next", event?: Area, account?: boolean) => void;
};

const EditorSelectEventAndAccount = ({ area, title, actions, onEvent }: EditorSelectEventAndAccountProps) => {
	const [selectedEvent, setSelectedEvent] = useState<string | null>(area.event?.id ?? null);
	const [selectedAccount, setSelectedAccount] = useState<boolean>(area.account);

	return (
		<EditorStepCardWrapper title={title} actions={actions}>
			<>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text text-neutral-content">Choose an event</span>
					</label>
					<select
						className="select select-bordered bg-neutral"
						value={selectedEvent ?? ""}
						onChange={(e) => setSelectedEvent(e.target.value)}
					>
						<option value={undefined} hidden>
							Pick one
						</option>
						{options.map((event) => (
							<option value={event.id} key={event.id}>
								{event.name}
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
							<Image src={area.service!.imageUrl} alt="Service logo" width={300} height={300} />
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
						disabled={!selectedEvent || !selectedAccount}
						onClick={() => onEvent("next", options.find((option) => option.id === selectedEvent)!, selectedAccount)}
					>
						Next
					</button>
				</div>
			</>
		</EditorStepCardWrapper>
	);
};

export default EditorSelectEventAndAccount;
