import Image from "next/image";
import { Workflow } from "@/types/workflows";

type LibraryWorkflowLineProps = {
	workflow: Workflow;
};
const LibraryWorkflowLine = ({ workflow: { name, pictures, running } }: LibraryWorkflowLineProps) => (
	<tr>
		<th>
			<label>
				<input type="checkbox" className="checkbox border-primary" />
			</label>
		</th>
		<td>
			<div className="flex items-center space-x-3">
				{pictures.map((picture) => (
					<div className="avatar" key={picture}>
						<div className="mask mask-squircle w-12 h-12">
							<Image src={picture} alt="Service logo" width={500} height={500} />
						</div>
					</div>
				))}
			</div>
		</td>
		<td>{name}</td>
		<td>
			<input type="checkbox" className="toggle toggle-success" defaultChecked={running} />
		</td>
		<th>
			<button className="btn btn-ghost btn-xs">details</button>
		</th>
	</tr>
);

export default LibraryWorkflowLine;
