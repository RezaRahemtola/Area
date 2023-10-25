import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import Navbar from "@/components/Navbar";
import { editorWorkflowAtom } from "@/stores/editor";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import services from "@/services";

type EditorNavbarProps = {
	isAuthenticated: boolean;
};
const EditorNavbar = ({ isAuthenticated }: EditorNavbarProps) => {
	const [workflow, setWorkflow] = useAtom(editorWorkflowAtom);
	const router = useRouter();
	const { t } = useTranslation();

	const onSaveWorkflow = async () => {
		let response;
		if (workflow.id !== undefined) {
			response = await services.workflows.update({ ...workflow, id: workflow.id });
			await services.workflows.toggleOne(workflow.id, workflow.active);
		} else {
			response = await services.workflows.create(workflow);
		}

		if (!response.error) {
			router.push("/dashboard");
		}
	};

	const onToggleWorkflow = (e: ChangeEvent<HTMLInputElement>) => {
		setWorkflow((prev) => ({ ...prev, active: e.target.checked }));
	};

	return (
		<Navbar
			beforeLogoContent={
				<>
					<button className="btn btn-ghost btn-xs" onClick={() => router.push("/dashboard")}>
						<FontAwesomeIcon icon="chevron-left" />
					</button>
					<input
						className="input w-full max-w-xs"
						type="text"
						value={workflow.name}
						onChange={(e) => setWorkflow((prev) => ({ ...prev, name: e.target.value }))}
					/>
				</>
			}
			hasLogo={false}
			centerContent={<span className="text-xl font-semibold">Area</span>}
			endContent={
				isAuthenticated ? (
					<>
						<input
							type="checkbox"
							name="workflow-running"
							className="toggle toggle-success mr-6"
							checked={workflow.active}
							onChange={onToggleWorkflow}
						/>
						<button className="btn btn-secondary" onClick={onSaveWorkflow}>
							{t("actions.save")}
						</button>
					</>
				) : undefined
			}
		/>
	);
};

export default EditorNavbar;
