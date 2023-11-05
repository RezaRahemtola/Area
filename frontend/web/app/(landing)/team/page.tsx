import Image from "next/image";
import Link from "next/link";

const members = [
	{
		name: "Dorian Moy",
		title: "Lead Backend",
		image: "https://github.com/Croos3r.png",
		github: "https://github.com/Croos3r",
		linkedin: "https://www.linkedin.com/in/dorian-moy/",
	},
	{
		name: "Florian Lauch",
		title: "Lead Workers",
		image: "https://github.com/EdenComp.png",
		github: "https://github.com/EdenComp",
		linkedin: "https://www.linkedin.com/in/florianlauch/",
	},
	{
		name: "Tom Bariteau",
		title: "Frontend Developer",
		image: "https://github.com/Tomi-Tom.png",
		github: "https://github.com/Tomi-Tom",
		linkedin: "https://www.linkedin.com/in/tom-bp/",
	},
	{
		name: "Axel Denis",
		title: "Mobile Developer",
		image: "https://github.com/axel-denis.png",
		github: "https://github.com/axel-denis",
		linkedin: "https://www.linkedin.com/in/axel-denis-dev/",
	},
	{
		name: "Reza Rahemtola",
		title: "Lead Frontend & DevOps",
		image: "https://github.com/RezaRahemtola.png",
		github: "https://github.com/RezaRahemtola",
		linkedin: "https://www.linkedin.com/in/reza-rahemtola/",
	},
];

const LandingPage = () => (
	<section className="min-h-screen w-full py-12 md:py-24 lg:py-32 bg-accent">
		<div className="container px-4 md:px-6 mx-auto">
			<div className="flex flex-col items-center space-y-4 text-center">
				<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Meet Our Team</h1>
				<p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
					We are a group of passionate individuals committed to our work.
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-10 justify-items-center">
				{members.map((member) => (
					<div className="flex flex-col items-center space-y-4" key={member.name}>
						<Image
							alt="Team member"
							className="rounded-full object-cover object-center"
							height="200"
							src={member.image}
							style={{
								aspectRatio: "200/200",
								objectFit: "cover",
							}}
							width="200"
						/>
						<h2 className="text-lg font-semibold">{member.name}</h2>
						<p className="text-sm text-zinc-500 dark:text-zinc-400">{member.title}</p>
						<div className="flex space-x-4">
							<Link href={member.linkedin} target="_blank">
								<svg
									className=" w-6 h-6 text-zinc-500 dark:text-zinc-400"
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
									<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
									<rect height="12" width="4" x="2" y="9" />
									<circle cx="4" cy="4" r="2" />
								</svg>
							</Link>
							<Link href={member.github} target="_blank">
								<svg
									className=" w-6 h-6 text-zinc-500 dark:text-zinc-400"
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
									<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
									<path d="M9 18c-4.51 2-5-2-7-2" />
								</svg>
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	</section>
);

export default LandingPage;
