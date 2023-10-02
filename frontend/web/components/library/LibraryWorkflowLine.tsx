import Image from "next/image";
import { Workflow } from "@/types/workflows";

type LibraryWorkflowLineProps = {
	workflow: Workflow;
	selected: boolean;
	onSelect: (workflowId: string, selected: boolean) => void;
};
const LibraryWorkflowLine = ({ workflow, selected, onSelect }: LibraryWorkflowLineProps) => (
	<tr>
		<th>
			<label>
				<input
					type="checkbox"
					className="checkbox border-primary"
					checked={selected}
					onChange={(e) => onSelect(workflow.id, e.target.checked)}
				/>
			</label>
		</th>
		<td>
			<div className="flex items-center space-x-3">
				{workflow.pictures.map((picture, index) => (
					<div className="avatar" key={index}>
						<div className="mask mask-squircle w-12 h-12">
							<Image src={picture} alt="Service logo" width={500} height={500} />
						</div>
					</div>
				))}
			</div>
		</td>
		<td>{workflow.name}</td>
		<td>
			<input type="checkbox" className="toggle toggle-success" defaultChecked={workflow.running} />
		</td>
		<th>
			<button className="btn btn-ghost btn-xs">details</button>
		</th>
	</tr>
);

export default LibraryWorkflowLine;
