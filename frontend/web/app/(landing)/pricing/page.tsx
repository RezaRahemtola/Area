const PricingPage = () => (
	<section className="min-h-screen w-full py-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
		<div className="container px-4 md:px-6">
			<div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3 md:gap-8">
				<div className="flex flex-col p-6 bg-neutral text-neutral-content shadow-lg rounded-lg dark:bg-zinc-850 justify-between border border-gray-300">
					<div>
						<h3 className="text-2xl font-bold text-center">Basic</h3>
						<div className="mt-4 text-center text-neutral-content/75">
							<span className="text-4xl font-bold">$29</span>/ month
						</div>
						<ul className="mt-4 space-y-2">
							<li className="flex items-center">
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
								720p Video Rendering
							</li>
							<li className="flex items-center">
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
								2GB Cloud Storage
							</li>
							<li className="flex items-center">
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
								Basic Video Templates
							</li>
						</ul>
					</div>
					<div className="mt-6">
						<button className="btn w-full">Get Started</button>
					</div>
				</div>
				<div className="relative flex flex-col p-6 bg-neutral text-neutral-content shadow-lg rounded-lg dark:bg-zinc-850 justify-between border border-secondary/75">
					<div className="px-3 py-1 text-sm text-white bg-gradient-to-r from-secondary/75 to-secondary/100 rounded-full inline-block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
						Popular
					</div>
					<div>
						<h3 className="text-2xl font-bold text-center">Pro</h3>
						<div className="mt-4 text-center text-neutral-content/75">
							<span className="text-4xl font-bold">$59</span>/ month
						</div>
						<ul className="mt-4 space-y-2">
							<li className="flex items-center">
								<svg
									className=" text-white text-2xs bg-green-500 rounded-full mr-2 p-1"
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
								1080p Video Rendering
							</li>
							<li className="flex items-center">
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
								10GB Cloud Storage
							</li>
							<li className="flex items-center">
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
								Premium Video Templates
							</li>
							<li className="flex items-center">
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
								Collaboration Tools
							</li>
						</ul>
					</div>
					<div className="mt-6">
						<button className="btn btn-secondary w-full bg-gradient-to-r from-secondary/75 to-secondary/100">
							Get Started
						</button>
					</div>
				</div>
				<div className="flex flex-col p-6 bg-neutral text-neutral-content shadow-lg rounded-lg dark:bg-zinc-850 justify-between border border-gray-300">
					<div>
						<h3 className="text-2xl font-bold text-center">Enterprise</h3>
						<div className="mt-4 text-center text-neutral-content/75">
							<span className="text-4xl font-bold">$99</span>/ month
						</div>
						<ul className="mt-4 space-y-2">
							<li className="flex items-center">
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
								4K Video Rendering
							</li>
							<li className="flex items-center">
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
								Unlimited Cloud Storage
							</li>
							<li className="flex items-center">
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
								Custom Video Templates
							</li>
							<li className="flex items-center">
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
								Advanced Collaboration Tools
							</li>
							<li className="flex items-center">
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
								Dedicated Support
							</li>
						</ul>
					</div>
					<div className="mt-6">
						<button className="btn w-full">Get Started</button>
					</div>
				</div>
			</div>
		</div>
	</section>
);

export default PricingPage;
