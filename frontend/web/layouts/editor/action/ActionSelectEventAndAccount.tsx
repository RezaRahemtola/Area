import { useAtom } from "jotai";
import { useState } from "react";

import Image from "next/image";
import { editorWorkflowAtom } from "@/stores/editor";
import { Area } from "@/types/services";
import EditorAreaStepCard from "@/layouts/editor/EditorAreaStepCard";

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

const ActionSelectEventAndAccount = ({ onNextStep }: { onNextStep: () => void }) => {
	const [workflow, setWorkflow] = useAtom(editorWorkflowAtom);
	const [selectedEvent, setSelectedEvent] = useState<string | null>(workflow.action.event?.id ?? null);
	const [selectedAccount, setSelectedAccount] = useState<boolean>(workflow.action.account);

	const onSave = () => {
		setWorkflow((prev) => ({
			...prev,
			action: {
				...prev.action,
				event: options.find((option) => option.id === selectedEvent),
				account: selectedAccount,
			},
		}));
		onNextStep();
	};

	return (
		<EditorAreaStepCard title="Action">
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
							<Image src={workflow.action.service!.imageUrl} alt="Service logo" width={300} height={300} />
						</div>
					</div>
				</button>

				<div className="card-actions">
					<button
						className="btn btn-primary btn-wide disabled:bg-accent"
						disabled={!selectedEvent || !selectedAccount}
						onClick={onSave}
					>
						Next
					</button>
				</div>
			</>
		</EditorAreaStepCard>
	);
};

export default ActionSelectEventAndAccount;
