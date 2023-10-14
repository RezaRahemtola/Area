import { MouseEventHandler } from "react";
import Image from "next/image";

import FontAwesomeIcon, { FontAwesomeIconType } from "@/components/FontAwesomeIcon";
import { EditorWorkflowElementService } from "@/types/workflows";

type EditorSummaryCardProps = {
	title: string;
	description: string;
	onClick: MouseEventHandler;
	icon: FontAwesomeIconType;
	service?: EditorWorkflowElementService;
};
const EditorSummaryCard = ({ title, description, onClick, icon, service }: EditorSummaryCardProps) => (
	<div className="card mx-auto w-96 shadow-2xl cursor-pointer" onClick={onClick}>
		<div className="card-body">
			<div className="flex">
				<div className="card shadow-xl">
					{service ? (
						<div className="card-body p-3">
							<div className="avatar m-auto">
								<div className="mask mask-squircle w-16 h-16">
									<Image src={service.imageUrl} alt="Service logo" width={300} height={300} />
								</div>
							</div>
						</div>
					) : (
						<div className="card-body">
							<FontAwesomeIcon icon={icon} />
						</div>
					)}
				</div>
				<div className="ml-5">
					<p className="text-xl">
						{title}
						{service ? ` - ${service.id}` : ""}
					</p>
					<p className="">{description}</p>
				</div>
			</div>
		</div>
	</div>
);

export default EditorSummaryCard;
