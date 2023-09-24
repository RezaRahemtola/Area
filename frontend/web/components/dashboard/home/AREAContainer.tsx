import React from 'react';

const AREAContainer = ({selected, setSelected, id}: { selected: number, setSelected: (selected: number) => void, id: number }) => (
        <div
            className={`w-1/3 h-1/3 min-w-[188px] ${selected === id ? 'bg-accent' : 'bg-primary'} flex flex-col justify-center items-center`}>
            {selected === id ?
                <button className="btn btn-secondary" onClick={() => {
                    selected === 1 ? setSelected(2) : setSelected(1);
                }}>
                    Create new AREA
                </button> :
                <div/>}
        </div>
    )


export default AREAContainer;