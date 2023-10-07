"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";

import EditorCards from "@/layouts/editor/EditorCards";
import { editorServicesAtom } from "@/stores/editor";
import services from "@/services";

const EditorPage = () => {
	const [, setEditorServices] = useAtom(editorServicesAtom);

	useEffect(() => {
		(async () => {
			const editorServices = await services.services.getAll();
			if (editorServices.data != null) {
				setEditorServices(editorServices.data);
			}
		})();
	}, []);

	return (
		<div className="bg-neutral text-neutral-content min-h-screen  w-screen justify-center items-center">
			<div className="pt-7">
				<EditorCards />
			</div>
		</div>
	);
};

export default EditorPage;
