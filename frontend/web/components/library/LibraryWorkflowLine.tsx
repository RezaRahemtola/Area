import Image from "next/image";
import { Workflow } from "@/types/workflows";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";

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
			<div className="dropdown dropdown-end">
				<button className="btn btn-ghost btn-xs">
					<FontAwesomeIcon icon="ellipsis" />
				</button>
				<ul
					tabIndex={0}
					className="dropdown-content z-[1] menu p-2 shadow-xl bg-neutral text-neutral-content rounded-box w-52"
				>
					<li>
						<a className="hover:text-neutral-content">Item 1</a>
					</li>
					<li>
						<a className="hover:text-neutral-content">Item 2</a>
					</li>
				</ul>
			</div>
		</th>
	</tr>
);

export default LibraryWorkflowLine;
