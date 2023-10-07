import Image from "next/image";

const NotAuthenticatedLayout = () => (
	<div className="hero min-h-screen bg-accent">
		<div className="hero-content block text-center">
			<Image src="/empty-states/not-authenticated.png" alt="Not authenticated" width={700} height={700} />
			<h1 className="text-4xl font-bold">Please log in to access this page</h1>
		</div>
	</div>
);

export default NotAuthenticatedLayout;
