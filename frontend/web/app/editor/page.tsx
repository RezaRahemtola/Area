"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";

import EditorCards from "@/layouts/editor/EditorCards";
import { servicesAtom } from "@/stores";
import services from "@/services";

const EditorPage = () => {
	const [, setServices] = useAtom(servicesAtom);

	useEffect(() => {
		(async () => {
			const fetchedServices = await services.services.getAll();
			if (fetchedServices.data != null) {
				setServices(fetchedServices.data);
			}
		})();
	}, []);

	return (
		<div className="bg-primary text-neutral-content min-h-screen  w-screen justify-center items-center">
			<div className="pt-7">
				<EditorCards />
			</div>
		</div>
	);
};

export default EditorPage;
