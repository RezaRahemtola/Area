import { ReactNode } from "react";

type AppPageWrapperProps = {
	title: string;
	children?: ReactNode;
};
const DashboardPageWrapper = ({ title, children }: AppPageWrapperProps) => (
	<div className="bg-neutral text-neutral-content w-screen h-screen justify-center items-center">
		<h1 className="text-3xl font-bold m-5">{title}</h1>
		{children}
	</div>
);

export default DashboardPageWrapper;
