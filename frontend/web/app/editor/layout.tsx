"use client";

import { ReactNode } from "react";
import { useAtom } from "jotai";

import "@/config/i18n";
import { userAuthTokenAtom } from "@/stores/user";
import EditorNavbar from "@/components/editor/EditorNavbar";
import NotAuthenticatedLayout from "@/layouts/auth/NotAuthenticatedLayout";

const EditorLayout = ({ children }: { children: ReactNode }) => {
	const [userAuthToken] = useAtom(userAuthTokenAtom);

	return (
		<>
			<EditorNavbar isAuthenticated={!!userAuthToken} />
			{userAuthToken ? children : <NotAuthenticatedLayout />}
		</>
	);
};

export default EditorLayout;
