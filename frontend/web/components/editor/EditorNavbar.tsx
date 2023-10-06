import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import { editorWorkflowAtom } from "@/stores/editor";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";

type EditorNavbarProps = {
	isAuthenticated: boolean;
};
const EditorNavbar = ({ isAuthenticated }: EditorNavbarProps) => {
	const [workflow, setWorkflow] = useAtom(editorWorkflowAtom);
	const router = useRouter();

	const onSaveWorkflow = () => {
		router.push("/dashboard");
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
					<button className="btn btn-secondary" onClick={onSaveWorkflow}>
						Save
					</button>
				) : undefined
			}
		/>
	);
};

export default EditorNavbar;
