import PricingPlanCard from "@/components/landing/pricing/PricingPlanCard";

const PricingPage = () => (
	<section className="min-h-screen w-full py-12 bg-accent">
		<h1 className="text-5xl font-extrabold text-center mb-10">Pricing</h1>
		<div className="container px-4 md:px-6 flex min-w-full justify-center">
			<div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3 md:gap-8 mt-10">
				<PricingPlanCard
					name="Basic"
					price={29}
					features={["5 workflows", "Workflows Templates", "Access all Services"]}
				/>
				<PricingPlanCard
					name="Pro"
					price={59}
					features={["100 workflows", "Pass Params between Areas", "Multi-reactions Workflows", "Custom Activity Logs"]}
					isPopular
				/>
				<PricingPlanCard
					name="Enterprise"
					price={99}
					features={["Unlimited workflows", "Premium Services", "Dedicated Support", "On-site account setup"]}
				/>
			</div>
		</div>
	</section>
);

export default PricingPage;
