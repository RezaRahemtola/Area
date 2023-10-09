"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { useAtom } from "jotai";

import LibraryWorkflowLine from "@/components/library/LibraryWorkflowLine";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import LibraryGlobalActions from "@/components/library/LibraryGlobalActions";
import { workflowsAtom } from "@/stores";
import services from "@/services";

import "@/styles/customCheckbox.css";

const LibraryWorkflowTable = () => {
	const [workflows, setWorkflows] = useAtom(workflowsAtom);
	const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
	const [globalSelect, setGlobalSelect] = useState(false);

	useEffect(() => {
		(async () => {
			const fetchedWorkflows = await services.workflows.getAll();
			if (fetchedWorkflows.data !== null) {
				setWorkflows(fetchedWorkflows.data);
			}
		})();
	}, []);

	const onSelectLine = (workflowId: string, selected: boolean) => {
		if (selected && !selectedWorkflows.includes(workflowId)) {
			if (selectedWorkflows.length + 1 === workflows.length) {
				setGlobalSelect(true);
			}
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

	const updateAllWorkflows = async () => {
		const fetchedWorkflows = await services.workflows.getAll();
		if (fetchedWorkflows.error || fetchedWorkflows.data === null) return;

		setWorkflows(fetchedWorkflows.data);

		const fetchedWorkflowIds = fetchedWorkflows.data.map((workflow) => workflow.id);
		setSelectedWorkflows((prev) => prev.filter((workflowId) => fetchedWorkflowIds.includes(workflowId)));
	};

	const onToggleAll = async (status: boolean) => {
		await services.workflows.toggleBulk(selectedWorkflows, status);
		await updateAllWorkflows();
	};

	const onDeleteAll = async () => {
		await services.workflows.deleteBulk(selectedWorkflows);
		await updateAllWorkflows();
	};

	const onWorkflowChange = async (workflowId: string) => {
		const fetchedWorkflow = await services.workflows.getOne(workflowId);

		if (fetchedWorkflow.error) {
			setWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
			setSelectedWorkflows((prev) => prev.filter((wId) => wId !== workflowId));
		} else if (fetchedWorkflow.data) {
			setWorkflows((prev) =>
				prev.map((workflow) => {
					if (workflow.id === workflowId) {
						return fetchedWorkflow.data;
					}
					return workflow;
				}),
			);
		}
	};

	return (
		<>
			{workflows.length === 0 ? (
				<div className="w-fit ml-4">
					<p className="text-center">You don't have any workflow</p>
					<Link href="/editor">
						<button className="btn btn-primary btn-outline btn-wide">Create one</button>
					</Link>
				</div>
			) : (
				<table className="table">
					<thead className="text-neutral-content">
						<tr>
							<th className="table-cell " colSpan={2}>
								<div className="flex">
									<label className="custom-checkbox">
										<input
											type="checkbox"
											className="global-workflow-selector"
											checked={globalSelect}
											onChange={onGlobalSelect}
										/>
										{selectedWorkflows.length === 0 ? (
											<FontAwesomeIcon icon="square" svgProps={{ className: "unchecked h-7 w-7" }} />
										) : (
											<FontAwesomeIcon icon="square-minus" svgProps={{ className: "unchecked h-7 w-7" }} />
										)}
										<FontAwesomeIcon icon="square-check" svgProps={{ className: "checked h-7 w-7" }} />
									</label>
									{selectedWorkflows.length !== 0 && (
										<LibraryGlobalActions
											onToggleOn={() => onToggleAll(true)}
											onToggleOff={() => onToggleAll(false)}
											onDelete={onDeleteAll}
										/>
									)}
								</div>
							</th>
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
								onWorkflowChange={onWorkflowChange}
							/>
						))}
					</tbody>
				</table>
			)}
		</>
	);
};

export default LibraryWorkflowTable;
