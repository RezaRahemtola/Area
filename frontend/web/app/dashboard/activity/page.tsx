"use client";

import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react";
import DashboardPageWrapper from "@/layouts/dashboard/DashboardPageWrapper";
import { Activity } from "@/types/activity";
import services from "@/services";

const ActivityPage = () => {
	const { t } = useTranslation();
	const [page, setPage] = useState(0);
	const [activities, setActivities] = useState<Activity[]>([]);

	useEffect(() => {
		(async () => {
			const fetchedActivities = await services.workflows.getActivities(page);
			setActivities(fetchedActivities.data ?? []);
		})();
	}, [page]);

	return (
		<DashboardPageWrapper title={t("activity.title")}>
			<table className="table">
				<thead className="text-neutral-content">
					<tr>
						<th>Time</th>
						<th>Workflow</th>
						<th>Activity</th>
					</tr>
				</thead>
				<tbody>
					{activities.map((activity) => (
						<tr key={activity.id}>
							<td>{activity.createdAt}</td>
							<td>{activity.workflow.name}</td>
							<td>{activity.type}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="flex justify-around items-center mt-10">
				<button
					className="btn btn-accent"
					onClick={() => {
						if (page > 0) setPage((prev) => prev - 1);
					}}
				>
					{t("editor.back")}
				</button>
				<span>Page {page + 1}</span>
				<button
					className="btn btn-accent"
					onClick={() => {
						if (activities.length >= 20) setPage((prev) => prev + 1);
					}}
				>
					{t("editor.next")}
				</button>
			</div>
		</DashboardPageWrapper>
	);
};

export default ActivityPage;
