import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import { editorWorkflowAtom } from "@/stores/editor";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import services from "@/services";
import { emitToastError } from "@/utils/toast";
import ThemeSelector from "@/components/ThemeSelector";

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
			if (!response.error) await services.workflows.toggleOne(workflow.id, workflow.active);
		} else {
			response = await services.workflows.create(workflow);
		}

		if (!response.error) {
			router.push("/dashboard/library");
		} else {
			emitToastError(response.error);
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
						className="input w-full max-w-xs bg-primary"
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
						<div style={{ display: "none" }}>
							<ThemeSelector />
						</div>
						<input
							type="checkbox"
							name="workflow-running"
							className="toggle toggle-success mr-6 bg-primary"
							checked={workflow.active}
							onChange={onToggleWorkflow}
						/>
						<button className="btn btn-secondary text-base-100" onClick={onSaveWorkflow}>
							{t("actions.save")}
						</button>
					</>
				) : undefined
			}
		/>
	);
};

export default EditorNavbar;
