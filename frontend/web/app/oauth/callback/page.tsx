"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAtom } from "jotai";
import LandingNavbar from "@/components/landing/LandingNavbar";
import { userAuthTokenAtom } from "@/stores/user";

const NotFoundPage = () => {
	const [, setUserAuthToken] = useAtom(userAuthTokenAtom);
	const { t } = useTranslation();
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const token = searchParams.get("token");
		if (token === null) return;
		setUserAuthToken(token);
		router.push("/dashboard");
	}, []);

	return (
		<>
			<LandingNavbar />
			<div className="hero min-h-screen bg-accent">
				<div className="hero-content block text-center">
					<Image
						src="/empty-states/sucess-oauth.png"
						className="mx-auto"
						alt="Auth successful"
						width={700}
						height={700}
					/>
					<h1 className="text-4xl font-bold">{t("auth.callbackOAuth")}</h1>
				</div>
			</div>
		</>
	);
};

export default NotFoundPage;
