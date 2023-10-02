import DashboardPageWrapper from "@/layouts/dashboard/DashboardPageWrapper";
import { Workflow } from "@/types/workflows";
import LibraryWorkflowLine from "@/components/library/LibraryWorkflowLine";

const LibraryPage = () => {
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

	return (
		<DashboardPageWrapper title="My workflows">
			<div className="overflow-x-auto">
				<table className="table">
					<thead className="text-neutral-content">
						<tr>
							<th>
								<label>
									<input type="checkbox" className="checkbox border-primary" />
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
							<LibraryWorkflowLine workflow={workflow} key={workflow.id} />
						))}
					</tbody>
				</table>
			</div>
		</DashboardPageWrapper>
	);
};

export default LibraryPage;
