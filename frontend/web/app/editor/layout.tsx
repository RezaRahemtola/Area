"use client";

import { ReactNode } from "react";
import { useAtom } from "jotai";

import { userAuthTokenAtom } from "@/stores/user";
import EditorNavbar from "@/components/editor/EditorNavbar";

const EditorLayout = ({ children }: { children: ReactNode }) => {
	const [userAuthToken] = useAtom(userAuthTokenAtom);

	return (
		<>
			<EditorNavbar />
			{userAuthToken ? children : <span>Please log in before using the app</span>}
		</>
	);
};

export default EditorLayout;
