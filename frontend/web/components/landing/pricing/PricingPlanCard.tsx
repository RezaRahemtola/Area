type PricingPlanCardProps = {
	name: string;
	price: number;
	features: string[];
	isPopular?: boolean;
};
const PricingPlanCard = ({ name, price, features, isPopular = false }: PricingPlanCardProps) => (
	<div
		className={`flex flex-col p-6 bg-neutral text-neutral-content shadow-lg rounded-lg justify-between border ${
			isPopular ? "border-secondary/75 relative" : ""
		}`}
	>
		{isPopular ? (
			<div className="px-3 py-1 text-sm text-white bg-gradient-to-r from-secondary/75 to-secondary/100 rounded-full inline-block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				Popular
			</div>
		) : (
			<></>
		)}
		<div>
			<h3 className="text-2xl font-bold text-center">{name}</h3>
			<div className="mt-4 text-center text-neutral-content/75">
				<span className="text-4xl font-bold">${price}</span>/ month
			</div>
			<ul className="mt-4 space-y-2">
				{features.map((feature) => (
					<li className="flex items-center" key={feature}>
						<svg
							className=" text-white text-xs bg-green-500 rounded-full mr-2 p-1"
							fill="none"
							height="24"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							width="24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
						{feature}
					</li>
				))}
			</ul>
		</div>
		<div className="mt-6">
			<button
				className={`btn w-full ${isPopular ? "btn-secondary bg-gradient-to-r from-secondary/75 to-secondary/100" : ""}`}
			>
				Get Started
			</button>
		</div>
	</div>
);

export default PricingPlanCard;
