import { useAtom } from "jotai/index";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import { EditorElement } from "@/types/workflows";
import { selectedEditorArea } from "@/stores/editor";

const ReactionCard = ({ reaction }: { reaction: EditorElement }) => {
	const [, setSelectedArea] = useAtom(selectedEditorArea);

	return (
		<div className="card mx-auto w-96 border-primary shadow-2xl" onClick={() => setSelectedArea(reaction.id)}>
			<div className="card-body">
				<div className="flex">
					<div className="card shadow-xl">
						<div className="card-body">
							<FontAwesomeIcon icon="bolt" />
						</div>
					</div>
					<div className="ml-5">
						<p className="text-xl">Reaction</p>
						<p className="">An event a workflow performs after it starts</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReactionCard;
