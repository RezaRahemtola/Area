"use client";

import { ChangeEvent, useState } from "react";
import LibraryWorkflowLine from "@/components/library/LibraryWorkflowLine";
import { Workflow } from "@/types/workflows";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";

import "@/styles/customCheckbox.css";

const workflows: Workflow[] = [
	{
		id: "1",
		name: "Zemlak, Daniel and Leannon",
		pictures: [
			"https://daisyui.com/tailwind-css-component-profile-2@56w.png",
			"https://daisyui.com/tailwind-css-component-profile-2@56w.png",
			"https://daisyui.com/tailwind-css-component-profile-2@56w.png",
		],
		running: true,
	},
	{
		id: "2",
		name: "Carroll Group",
		pictures: ["https://daisyui.com/tailwind-css-component-profile-3@56w.png"],
		running: false,
	},
	{
		id: "3",
		name: "Rowe-Schoen",
		pictures: ["https://daisyui.com/tailwind-css-component-profile-4@56w.png"],
		running: false,
	},
	{
		id: "4",
		name: "Wyman-Ledner",
		pictures: ["https://daisyui.com/tailwind-css-component-profile-5@56w.png"],
		running: false,
	},
];

const LibraryWorkflowTable = () => {
	const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
	const [globalSelect, setGlobalSelect] = useState(false);

	const onSelectLine = (workflowId: string, selected: boolean) => {
		if (selected && !selectedWorkflows.includes(workflowId)) {
			setSelectedWorkflows((prev) => [...prev, workflowId]);
		} else {
			setSelectedWorkflows((prev) => prev.filter((workflow) => workflow !== workflowId));
			setGlobalSelect(false);
		}
	};

	const onGlobalSelect = (e: ChangeEvent<HTMLInputElement>) => {
		const newCheckedState = e.target.checked;

		if (newCheckedState && selectedWorkflows.length === 0) {
			// No selected workflows, selecting all
			setSelectedWorkflows(workflows.map((workflow) => workflow.id));
			setGlobalSelect(true);
		} else {
			// Some selected workflows -> reset, or uncheck
			setSelectedWorkflows([]);
			setGlobalSelect(false);
		}
	};

	return (
		<div className="overflow-x-auto">
			<table className="table">
				<thead className="text-neutral-content">
					<tr>
						<th>
							<label className="custom-checkbox">
								<input type="checkbox" checked={globalSelect} onChange={onGlobalSelect} />
								{selectedWorkflows.length === 0 ? (
									<FontAwesomeIcon icon="square" svgProps={{ className: "unchecked h-7 w-7" }} />
								) : (
									<FontAwesomeIcon icon="square-minus" svgProps={{ className: "unchecked h-7 w-7" }} />
								)}
								<FontAwesomeIcon icon="square-check" svgProps={{ className: "checked h-7 w-7" }} />
							</label>
						</th>
						<th></th>
						<th>Name</th>
						<th>Running</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{workflows.map((workflow) => (
						<LibraryWorkflowLine
							workflow={workflow}
							key={workflow.id}
							selected={selectedWorkflows.includes(workflow.id)}
							onSelect={onSelectLine}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default LibraryWorkflowTable;
