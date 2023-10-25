"use client";

import { useTranslation } from "react-i18next";

import DashboardPageWrapper from "@/layouts/dashboard/DashboardPageWrapper";
import LibraryWorkflowTable from "@/layouts/library/LibraryWorkflowTable";

const LibraryPage = () => {
	const { t } = useTranslation();

	return (
		<DashboardPageWrapper title={t("library.title")}>
			<LibraryWorkflowTable />
		</DashboardPageWrapper>
	);
};

export default LibraryPage;
