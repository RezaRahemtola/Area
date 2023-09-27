import React from "react";
import Link from "next/link";

import FontAwesomeIcon, { FontAwesomeIconType } from "@/components/FontAwesomeIcon";

type DashboardMenuElementProps = {
	icon: FontAwesomeIconType;
	title: string;
	href: string;
	isFull: boolean;
};

const DashboardMenuLink = ({ icon, title, href, isFull }: DashboardMenuElementProps) => (
	<li>
		<Link className={isFull ? "" : "tooltip tooltip-right"} data-tip={title} href={href}>
			<FontAwesomeIcon icon={icon} />
			{isFull ? title : ""}
		</Link>
	</li>
);

const DashboardMenuButton = ({ icon, title, href, isFull }: DashboardMenuElementProps) => (
	<Link className="justify-center" href={href}>
		<button className="btn btn-secondary btn-wide">
			<FontAwesomeIcon icon={icon} /> {isFull ? title : ""}
		</button>
	</Link>
);

export { DashboardMenuLink, DashboardMenuButton };
