import Image from "next/image";
import Link from "next/link";

const LandingGeneralHero = () => (
	<div className="hero min-h-screen bg-primary">
		<div className="hero-content text-center">
			<div className="max-w-lg">
				<h1 className="text-5xl font-extrabold text-base-100">CREATE, AUTOMATE,</h1>
				<h1 className="text-7xl font-extrabold leading-relaxed text-base-100">SUCCEED</h1>
				<p className="py-6 text-base-100">
					Unlock boundless innovation and creativity with AREA. Our revolutionary software empowers you to turn ideas
					into reality, automate tasks, and achieve excellence effortlessly. Join us on a journey where the
					extraordinary becomes routine.
				</p>
				<Link href="/dashboard" className="btn btn-secondary text-base-100">
					Get Started
				</Link>
				<Image src="/landing/main.webp" width="1168" height="657" alt="landing-image" className="w-lg" />
			</div>
		</div>
	</div>
);

export default LandingGeneralHero;
