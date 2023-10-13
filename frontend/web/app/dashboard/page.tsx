"use client";

import { useTranslation } from "react-i18next";

import DashboardPageWrapper from "@/layouts/dashboard/DashboardPageWrapper";

const DashboardPage = () => {
	const { t } = useTranslation();

	return <DashboardPageWrapper title={t("dashboard.title")} />;
};

export default DashboardPage;
