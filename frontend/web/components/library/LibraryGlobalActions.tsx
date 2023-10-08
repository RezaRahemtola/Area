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

type LibraryGlobalActionsProps = {
	onToggleOn: () => void;
	onToggleOff: () => void;
	onDelete: () => void;
};
const LibraryGlobalActions = ({ onToggleOn, onToggleOff, onDelete }: LibraryGlobalActionsProps) => (
	<div className="flex w-2/3 justify-around mx-8">
		<LibraryGlobalAction tip="Turn on" icon="solid-bolt" onClick={onToggleOn} />
		<LibraryGlobalAction tip="Turn off" icon="solid-bolt-slash" onClick={onToggleOff} />
		<LibraryGlobalAction tip="Delete" icon="trash" onClick={onDelete} />
	</div>
);

export default LibraryGlobalActions;
