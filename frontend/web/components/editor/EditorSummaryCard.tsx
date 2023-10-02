import { MouseEventHandler } from "react";
import FontAwesomeIcon, { FontAwesomeIconType } from "@/components/FontAwesomeIcon";

type EditorSummaryCardProps = {
	title: string;
	description: string;
	icon: FontAwesomeIconType;
	onClick: MouseEventHandler;
};
const EditorSummaryCard = ({ title, description, icon, onClick }: EditorSummaryCardProps) => (
	<div className="card mx-auto w-96 shadow-2xl cursor-pointer" onClick={onClick}>
		<div className="card-body">
			<div className="flex">
				<div className="card shadow-xl">
					<div className="card-body">
						<FontAwesomeIcon icon={icon} />
					</div>
				</div>
				<div className="ml-5">
					<p className="text-xl">{title}</p>
					<p className="">{description}</p>
				</div>
			</div>
		</div>
	</div>
);

export default EditorSummaryCard;
