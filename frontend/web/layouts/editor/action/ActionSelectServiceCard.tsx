import Image from "next/image";

import FontAwesomeIcon from "@/components/FontAwesomeIcon";

const ActionServiceElement = () => (
	<button className="btn btn-ghost normal-case">
		<div className="flex">
			<div className="avatar">
				<div className="mask mask-squircle w-8 h-8">
					<Image
						src="https://daisyui.com/tailwind-css-component-profile-2@56w.png"
						alt="Service logo"
						width={500}
						height={500}
					/>
				</div>
			</div>
			<p className="text-xl font-semibold ml-2">GitHub</p>
		</div>
	</button>
);
const ActionSelectServiceCard = () => (
	<div className="card mx-auto w-2/3 shadow-2xl">
		<div className="card-body items-center pt-3">
			<div className="flex mb-5">
				<FontAwesomeIcon icon="bolt" svgProps={{ className: "h-7 w-7" }} />
				<p className="card-title text-2xl ml-2">Action</p>
			</div>

			<div className="flex w-full justify-around my-2">
				<ActionServiceElement />
				<ActionServiceElement />
				<ActionServiceElement />
			</div>

			<div className="flex w-full justify-around my-2">
				<ActionServiceElement />
				<ActionServiceElement />
				<ActionServiceElement />
			</div>
		</div>
	</div>
);

export default ActionSelectServiceCard;
