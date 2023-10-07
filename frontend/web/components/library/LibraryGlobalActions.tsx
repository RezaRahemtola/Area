import FontAwesomeIcon, { FontAwesomeIconType } from "@/components/FontAwesomeIcon";

type LibraryGlobalActionProps = {
	tip: string;
	icon: FontAwesomeIconType;
	onClick: () => void;
};
const LibraryGlobalAction = ({ tip, icon, onClick }: LibraryGlobalActionProps) => (
	<div className="tooltip tooltip-accent tooltip-bottom" data-tip={tip}>
		<button className="btn btn-ghost btn-xs" onClick={onClick}>
			<FontAwesomeIcon icon={icon} />
		</button>
	</div>
);

const LibraryGlobalActions = () => (
	<div className="flex w-2/3 justify-around mx-8">
		<LibraryGlobalAction tip="Turn on" icon="solid-bolt" onClick={() => {}} />
		<LibraryGlobalAction tip="Turn off" icon="solid-bolt-slash" onClick={() => {}} />
		<LibraryGlobalAction tip="Delete" icon="trash" onClick={() => {}} />
	</div>
);

export default LibraryGlobalActions;
