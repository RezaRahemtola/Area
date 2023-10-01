import FontAwesomeIcon from "@/components/FontAwesomeIcon";

const EditorSeparator = () => (
	<>
		<div className="flex w-full justify-center">
			<div className="min-h-12 w-0.5 bg-secondary opacity-100 dark:opacity-50"></div>
		</div>

		<div className="flex w-full justify-center">
			<button className="btn btn-circle btn-sm">
				<FontAwesomeIcon icon="plus" svgProps={{ className: "h-6 w-6 ml-1" }} />
			</button>
		</div>

		<div className="flex w-full justify-center">
			<div className="min-h-12 w-0.5 bg-secondary opacity-100 dark:opacity-50"></div>
		</div>
	</>
);

export default EditorSeparator;
