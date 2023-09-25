import {Dispatch, SetStateAction} from "react";
import AuthLayout from "@/layouts/auth/AuthLayout";

type DashboardNavbarProps = {
    isDrawerOpen: boolean;
    setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

const DashboardNavbar = ({isDrawerOpen, setIsDrawerOpen}: DashboardNavbarProps) => (
    <div className="flex-shrink-0 flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <button className="btn btn-square btn-ghost" onClick={() => setIsDrawerOpen((prev) => !prev)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                        isDrawerOpen
                            ? "M16.29 6.29001L12 10.59L7.71004 6.29001L6.29004 7.71001L10.59 12L6.29004 16.29L7.71004 17.71L12 13.41L16.29 17.71L17.71 16.29L13.41 12L17.71 7.71001L16.29 6.29001Z"
                            : "M4 6h16M4 12h16M4 18h16"
                    }
                ></path>
            </svg>
        </button>
        <div>
            <AuthLayout/>
        </div>
    </div>
);

export default DashboardNavbar;
