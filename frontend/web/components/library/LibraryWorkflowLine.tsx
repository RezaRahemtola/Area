"use client";

import Image from "next/image";
import { ChangeEvent, MouseEventHandler, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";

import { Workflow } from "@/types/workflows";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import RenameWorkflowModal from "@/components/library/modals/RenameWorkflowModal";
import { libraryOpenedWorkflowOptionsAtom } from "@/stores/library";
import { servicesAtom } from "@/stores";
import services from "@/services";

const ServiceLogo = ({ serviceId }: { serviceId: string }) => {
	const [servicePicture, setServicePicture] = useState<string | undefined>();
	const [cachedServices, setCachedServices] = useAtom(servicesAtom);

	useEffect(() => {
		(async () => {
			const service = cachedServices.find((s) => s.id === serviceId);
			if (service !== undefined) {
				setServicePicture(service.imageUrl);
			} else {
				const fetchedService = await services.services.getOne(serviceId);
				if (fetchedService.data !== null) {
					setCachedServices((prev) => [...prev, fetchedService.data]);
					setServicePicture(fetchedService.data.imageUrl);
				}
			}
		})();
	}, []);

	return (
		<div className="avatar">
			<div className="mask mask-squircle w-12 h-12">
				{servicePicture && <Image src={servicePicture} alt="Service logo" width={500} height={500} />}
			</div>
		</div>
	);
};

type LibraryWorkflowLineProps = {
	workflow: Workflow;
	selected: boolean;
	onSelect: (workflowId: string, selected: boolean) => void;
	onWorkflowChange: (workflowId: string) => void;
};
const LibraryWorkflowLine = ({ workflow, selected, onSelect, onWorkflowChange }: LibraryWorkflowLineProps) => {
	const [openedWorkflowOptions, setOpenedWorkflowOptions] = useAtom(libraryOpenedWorkflowOptionsAtom);
	const renameModalRef = useRef<HTMLDialogElement>(null);

	const onOpenOptions: MouseEventHandler<HTMLDetailsElement> = (event) => {
		event.preventDefault();
		setOpenedWorkflowOptions((prev) => {
			if (prev === workflow.id) {
				return null;
			}
			return workflow.id;
		});
	};
	const onClickRename = () => {
		renameModalRef.current?.showModal();
	};
	const onRenameSuccess = () => {
		// TODO Reza: update state
		renameModalRef.current?.close();
	};

	const onToggle = async (e: ChangeEvent<HTMLInputElement>) => {
		await services.workflows.toggleOne(workflow.id, e.target.checked);
		onWorkflowChange(workflow.id);
	};

	return (
		<tr>
			<th>
				<label>
					<input
						type="checkbox"
						name="workflow-selector"
						className="checkbox border-primary"
						checked={selected}
						onChange={(e) => onSelect(workflow.id, e.target.checked)}
					/>
				</label>
			</th>
			<td>
				<div className="flex items-center space-x-3">
					<ServiceLogo serviceId={workflow.action.areaServiceId} />

					{workflow.reactions.map((reaction) => (
						<ServiceLogo serviceId={reaction.areaServiceId} key={reaction.id} />
					))}
				</div>
			</td>
			<td>{workflow.name}</td>
			<td>
				<input
					type="checkbox"
					name="workflow-running"
					className="toggle toggle-success"
					checked={workflow.active}
					onChange={onToggle}
				/>
			</td>
			<th>
				<RenameWorkflowModal ref={renameModalRef} workflow={workflow} onSuccess={onRenameSuccess} />
				<details className="dropdown dropdown-end" open={openedWorkflowOptions === workflow.id} onClick={onOpenOptions}>
					<summary className="btn btn-ghost btn-xs">
						<FontAwesomeIcon icon="ellipsis" />
					</summary>
					<ul className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-content rounded-box w-52">
						<li>
							<a className="hover:text-neutral-content" onClick={onClickRename}>
								<FontAwesomeIcon icon="pen" />
								Rename
							</a>
						</li>
						<li>
							{/* TODO Reza: Delete */}
							<a className="hover:text-neutral-content">
								<FontAwesomeIcon icon="trash" />
								Delete
							</a>
						</li>
					</ul>
				</details>
			</th>
		</tr>
	);
};

export default LibraryWorkflowLine;
