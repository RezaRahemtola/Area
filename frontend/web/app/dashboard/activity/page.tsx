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

	const getFormattedDate = (date: string) => {
		const d = new Date(date);

		return `${`0${d.getDate()}`.slice(-2)}-${`0${d.getMonth() + 1}`.slice(
			-2,
		)}-${d.getFullYear()} ${`0${d.getHours()}`.slice(-2)}:${`0${d.getMinutes()}`.slice(
			-2,
		)}:${`0${d.getSeconds()}`.slice(-2)}`;
	};

	return (
		<DashboardPageWrapper title={t("activity.title")}>
			<table className="table">
				<thead className="text-neutral-content">
					<tr>
						<th>{t("activity.time")}</th>
						<th>{t("activity.workflow")}</th>
						<th>{t("activity.title")}</th>
					</tr>
				</thead>
				<tbody>
					{activities.map((activity) => (
						<tr key={activity.id}>
							<td>{getFormattedDate(activity.createdAt)}</td>
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
