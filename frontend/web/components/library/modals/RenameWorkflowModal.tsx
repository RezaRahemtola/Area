import { forwardRef, useState } from "react";
import Modal from "@/components/Modal";
import { Workflow } from "@/types/workflows";
import services from "@/services";

type RenameWorkflowModalProps = {
	workflow: Workflow;
	onSuccess: () => void;
};
const RenameWorkflowModal = forwardRef<HTMLDialogElement, RenameWorkflowModalProps>(({ workflow, onSuccess }, ref) => {
	const [newName, setNewName] = useState(workflow.name);

	const onSubmit = async () => {
		await services.workflows.update({ id: workflow.id, name: newName });
		onSuccess();
	};

	return (
		<dialog ref={ref} className="modal">
			<Modal title="Rename workflow">
				<div className="mt-5 mb-7">
					<label className="label">
						<span className="text-base label-text">New name</span>
					</label>
					<input className="w-full input input-bordered" value={newName} onChange={(e) => setNewName(e.target.value)} />
				</div>

				<button className="btn btn-block btn-accent" onClick={onSubmit} disabled={!newName}>
					Save
				</button>
			</Modal>
			<form method="dialog" className="modal-backdrop">
				<button>Close</button>
			</form>
		</dialog>
	);
});

export default RenameWorkflowModal;
