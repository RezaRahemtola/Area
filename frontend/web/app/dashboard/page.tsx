import React from "react";
import AREAContainer from "@/components/dashboard/home/actionReactionContainer";

const DashboardPage = () => (
    <div className="flex bg-neutral w-screen h-screen justify-center items-center flex-row">
        <AREAContainer/>
        <span>{"->"}</span>
        <AREAContainer/>
    </div>
)

export default DashboardPage;
