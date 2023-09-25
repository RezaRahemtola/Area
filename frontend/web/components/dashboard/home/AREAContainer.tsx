import React, {Dispatch, SetStateAction} from "react";

type AREAContainerProps = {
    selected: number;
    setSelected: Dispatch<SetStateAction<number>>;
    id: number;
}

const AREAContainer = ({selected, setSelected, id}: AREAContainerProps) => (
    <div
        className={`w-1/3 h-1/3 min-w-[188px] flex flex-col justify-center items-center${  selected === id ? " bg-accent" : " bg-primary"}`}>
        {selected === id ?
            <button className="btn btn-secondary" onClick={() => {
                setSelected(selected === 1 ? 2 : 1);
            }}>
                Create new AREA
            </button> :
            <div/>}
    </div>
)

export default AREAContainer;