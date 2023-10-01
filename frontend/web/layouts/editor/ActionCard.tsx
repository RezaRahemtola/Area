import FontAwesomeIcon from "@/components/FontAwesomeIcon";

const ActionCard = () => (
	<div className="card mx-auto w-96 border-primary shadow-2xl">
		<div className="card-body">
			<div className="flex">
				<div className="card shadow-xl">
					<div className="card-body">
						<FontAwesomeIcon icon="bolt" />
					</div>
				</div>
				<div className="ml-5">
					<p className="text-xl">Action</p>
					<p className="">An event that starts your workflow</p>
				</div>
			</div>
		</div>
	</div>
);

export default ActionCard;
