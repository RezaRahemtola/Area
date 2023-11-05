"use client";

import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react";
import DashboardPageWrapper from "@/layouts/dashboard/DashboardPageWrapper";
import { UserStats } from "@/services/user/me";
import services from "@/services";

const DashboardPage = () => {
	const [stats, setStats] = useState<UserStats | null>(null);
	const { t } = useTranslation();

	useEffect(() => {
		(async () => {
			const response = await services.user.getStats();
			setStats(response.data ?? null);
		})();
	}, []);

	return (
		<DashboardPageWrapper title={t("dashboard.title")}>
			{stats && (
				<div className="stats shadow bg-primary w-full">
					<div className="stat place-items-center">
						<div className="stat-title">{t("landing.workflows")}</div>
						<div className="stat-value text-secondary">{stats.workflows}</div>
					</div>

					<div className="stat place-items-center bg-primary">
						<div className="stat-title">{t("landing.active")}</div>
						<div className="stat-value text-secondary">{stats.activeWorkflows}</div>
					</div>

					<div className="stat place-items-center bg-primary">
						<div className="stat-title">{t("landing.errors")}</div>
						<div className="stat-value text-secondary">{stats.workflowErrors}</div>
					</div>

					<div className="stat place-items-center bg-primary">
						<div className="stat-title">{t("landing.runs")}</div>
						<div className="stat-value text-secondary">{stats.workflowRuns}</div>
					</div>
				</div>
			)}
		</DashboardPageWrapper>
	);
};

export default DashboardPage;
