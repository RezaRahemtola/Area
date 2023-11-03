import Image from "next/image";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import ApkDownloadButton from "@/components/ApkDownloadButton";

const Footer = () => (
	<footer className="footer p-10 bg-primary text-primary-content">
		<aside>
			<Image src="/logo.png" alt="Area logo" width={50} height={50} />
			<p>
				Area Industries Ltd.
				<br />
				Providing reliable tech since 2023
			</p>
		</aside>
		<nav>
			<header className="footer-title">Social</header>
			<div className="grid grid-flow-col gap-4">
				<a href="https://github.com/RezaRahemtola/Area" target="_blank">
					<FontAwesomeIcon icon="github" svgProps={{ width: "24", height: "24" }} />
				</a>
				<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
						<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
					</svg>
				</a>
				<a href="https://i.imgflip.com/2kcd2x.jpg" target="_blank">
					<FontAwesomeIcon icon="facebook" svgProps={{ width: "24", height: "24" }} />
				</a>
			</div>
		</nav>
		<ApkDownloadButton />
	</footer>
);

export default Footer;
