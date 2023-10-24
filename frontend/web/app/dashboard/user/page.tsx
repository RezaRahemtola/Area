"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import DashboardPageWrapper from "@/layouts/dashboard/DashboardPageWrapper";
import services from "@/services";
import { User } from "@/types/user";
import UserSettings from "@/layouts/user/UserSettings";

const UserPage = () => {
	const [userData, setUserData] = useState<User | null>(null);
	const { t } = useTranslation();

	useEffect(() => {
		(async () => {
			const userProfile = await services.user.getProfile();
			setUserData(userProfile.data);
		})();
	}, []);

	return (
		<DashboardPageWrapper title={t("user.settings.title")}>
			{userData && <UserSettings user={userData} />}
		</DashboardPageWrapper>
	);
};

export default UserPage;
