import DashboardPageWrapper from "@/layouts/dashboard/DashboardPageWrapper";
import LibraryWorkflowTable from "@/layouts/library/LibraryWorkflowTable";

const LibraryPage = () => (
	<DashboardPageWrapper title="My workflows">
		<LibraryWorkflowTable />
	</DashboardPageWrapper>
);

export default LibraryPage;
