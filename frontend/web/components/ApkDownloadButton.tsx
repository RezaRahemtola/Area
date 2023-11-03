"use client";

import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import { useTranslation } from "react-i18next";

import FontAwesomeIcon from "@/components/FontAwesomeIcon";

const ApkDownloadButton = () => {
	const [isApkAvailable, setIsApkAvailable] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		(async () => {
			const isFileAvailable = async (url: string) => {
				let statusCode = StatusCodes.OK;
				try {
					await axios.head(url);
				} catch (error) {
					if (isAxiosError(error) && error.response !== undefined) {
						statusCode = error.response.status;
					}
				}
				return statusCode !== StatusCodes.NOT_FOUND;
			};

			const isAvailable = await isFileAvailable("/apk/area.apk");
			setIsApkAvailable(isAvailable);
		})();
	}, []);

	return (
		<>
			{isApkAvailable ? (
				<nav>
					<a href="/apk/area.apk" download>
						<button className="btn btn-accent">
							<FontAwesomeIcon icon="android" />
							{t("landing.actions.downloadApk")}
						</button>
					</a>
				</nav>
			) : (
				<></>
			)}
		</>
	);
};

export default ApkDownloadButton;
