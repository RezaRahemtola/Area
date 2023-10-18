import React from "react";
import Link from "next/link";

import FontAwesomeIcon, { FontAwesomeIconType } from "@/components/FontAwesomeIcon";

type DashboardMenuElementProps = {
	icon: FontAwesomeIconType;
	title: string;
	href: string;
	isFull: boolean;
	onClick?: () => void;
};

const DashboardMenuLink = ({ icon, title, href, isFull }: DashboardMenuElementProps) => (
	<li>
		<Link className={isFull ? "" : "justify-center"} href={href}>
			<FontAwesomeIcon icon={icon} svgProps={isFull ? undefined : { className: "h-6 w-6" }} />
			{isFull ? title : ""}
		</Link>
	</li>
);

const DashboardMenuButton = ({ icon, title, href, isFull, onClick }: DashboardMenuElementProps) => (
	<Link className="justify-center" href={href} onClick={onClick}>
		<button className={`btn btn-secondary ${isFull ? "btn-wide" : ""}`}>
			<FontAwesomeIcon icon={icon} /> {isFull ? title : ""}
		</button>
	</Link>
);

export { DashboardMenuLink, DashboardMenuButton };
