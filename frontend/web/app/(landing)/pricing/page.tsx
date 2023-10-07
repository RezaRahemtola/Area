import PricingPlanCard from "@/components/landing/pricing/PricingPlanCard";

const PricingPage = () => (
	<section className="min-h-screen w-full py-12 bg-accent flex items-center justify-center">
		<div className="container px-4 md:px-6">
			<div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3 md:gap-8">
				<PricingPlanCard
					name="Basic"
					price={29}
					features={["720p Video Rendering", "2GB Cloud Storage", "Basic Video Templates"]}
				/>
				<PricingPlanCard
					name="Pro"
					price={59}
					features={["1080p Video Rendering", "10GB Cloud Storage", "Premium Video Templates", "Collaboration Tools"]}
					isPopular
				/>
				<PricingPlanCard
					name="Enterprise"
					price={99}
					features={[
						"4K Video Rendering",
						"Unlimited Cloud Storage",
						"Custom Video Templates",
						"Advanced Collaboration Tools",
						"Dedicated Support",
					]}
				/>
			</div>
		</div>
	</section>
);

export default PricingPage;
