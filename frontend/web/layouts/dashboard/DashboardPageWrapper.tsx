import { ReactNode } from "react";

type AppPageWrapperProps = {
	title: string;
	children?: ReactNode;
};
const DashboardPageWrapper = ({ title, children }: AppPageWrapperProps) => (
	<div className="bg-primary text-neutral-content w-screen justify-center items-center">
		<h1 className="text-3xl font-bold m-5 text-center text-base-100">{title}</h1>
		{children}
	</div>
);

export default DashboardPageWrapper;
