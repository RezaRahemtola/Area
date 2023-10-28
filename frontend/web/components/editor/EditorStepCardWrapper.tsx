import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import FontAwesomeIcon from "@/components/FontAwesomeIcon";

type EditorStepCardWrapperProps = {
	title: string;
	children: ReactNode;
	actions: { enabled: true; onDeleteStep: () => void } | { enabled: false };
};

const EditorStepCardWrapper = ({ title, children, actions }: EditorStepCardWrapperProps) => {
	const { t } = useTranslation();

	return (
		<div className="card mx-auto w-2/3 shadow-2xl">
			<div className="card-body items-center pt-3">
				<div className="flex w-full mb-5">
					<p className="card-title justify-center text-2xl ml-2">
						<FontAwesomeIcon icon="bolt" svgProps={{ className: "h-7 w-7" }} /> {title}
					</p>
					{actions.enabled && (
						<div className="dropdown">
							<button tabIndex={0} className="btn btn-ghost btn-xs">
								<FontAwesomeIcon icon="ellipsis" />
							</button>
							<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-content rounded-box w-52">
								<li>
									<a className="hover:text-neutral-content" onClick={actions.onDeleteStep}>
										<FontAwesomeIcon icon="trash" />
										{t("actions.delete")}
									</a>
								</li>
							</ul>
						</div>
					)}
				</div>
				{children}
			</div>
		</div>
	);
};

export default EditorStepCardWrapper;
