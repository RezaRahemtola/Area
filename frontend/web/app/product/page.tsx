"use client";

import React, {useState} from "react";
import AREAContainer from "@/components/dashboard/home/AREAContainer";

const DashboardPage = () => {
    const [areaSelected, setAreaSelected] = useState(1);

    return (
        <div className="flex bg-neutral w-screen h-screen justify-center items-center flex-row">
            <AREAContainer selected={areaSelected} setSelected={setAreaSelected} id={1}/>
            <span>{"->"}</span>
            <AREAContainer selected={areaSelected} setSelected={setAreaSelected} id={2}/>
            <span>{"->"}</span>
        </div>
    );
}

export default DashboardPage;


