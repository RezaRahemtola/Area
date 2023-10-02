import { ReactNode } from "react";

import FontAwesomeIcon from "@/components/FontAwesomeIcon";

type EditorAreaStepCardProps = {
	title: string;
	children: ReactNode;
};

const EditorAreaStepCard = ({ title, children }: EditorAreaStepCardProps) => (
	<div className="card mx-auto w-2/3 shadow-2xl">
		<div className="card-body items-center pt-3">
			<div className="flex mb-5">
				<FontAwesomeIcon icon="bolt" svgProps={{ className: "h-7 w-7" }} />
				<p className="card-title text-2xl ml-2">{title}</p>
			</div>
			{children}
		</div>
	</div>
);

export default EditorAreaStepCard;
