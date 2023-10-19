import Image from "next/image";
import { Service } from "@/types/services";
import { splitArrayInChunks } from "@/utils/arrays";

const ServiceElement = ({
	service,
	onClick,
	selected,
}: {
	service: Service;
	onClick: (service: Service) => void;
	selected: boolean;
}) => (
	<button className={`btn normal-case ${selected ? "btn-secondary" : "btn-ghost"}`} onClick={() => onClick(service)}>
		<div className="flex">
			<div className="avatar">
				<div className="mask mask-squircle w-8 h-8">
					<Image src={service.imageUrl} alt="Service logo" width={500} height={500} />
				</div>
			</div>
			<p className="text-xl font-semibold ml-2">{service.id}</p>
		</div>
	</button>
);

type ServicesListProps = {
	services: Service[];
	nbPerLine: number;
	selectedServiceId?: string;
	setSelectedService?: (serviceId: string) => void;
};
const ServicesList = ({ services, nbPerLine, selectedServiceId, setSelectedService }: ServicesListProps) => {
	const servicesChunks = splitArrayInChunks(services, nbPerLine);

	return (
		<>
			{servicesChunks.map((chunk) => (
				<div className="flex w-full justify-around my-2" key={JSON.stringify(chunk)}>
					{chunk.map((service) => (
						<ServiceElement
							service={service}
							onClick={() => {
								if (setSelectedService) setSelectedService(service.id);
							}}
							key={service.id}
							selected={selectedServiceId === service.id}
						/>
					))}
				</div>
			))}
		</>
	);
};

export default ServicesList;
