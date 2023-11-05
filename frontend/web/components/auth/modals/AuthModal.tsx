import { forwardRef, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import FontAwesomeIcon from "@/components/FontAwesomeIcon";
import Modal from "@/components/Modal";
import { Service } from "@/types/services";
import services from "@/services";

type AuthModalProps = {
	title: string;
	formChildren: ReactNode;
	errorMessage?: string;
	onClose: () => void;
	switchMethodCtaText: string;
	switchMethodActionText: string;
	onAuthTypeChange: () => void;
};

const AuthModal = forwardRef<HTMLDialogElement, AuthModalProps>(
	(
		{ title, formChildren, errorMessage, onClose, switchMethodCtaText, switchMethodActionText, onAuthTypeChange },
		ref,
	) => {
		const [oAuthServices, setOAuthServices] = useState<Service[]>([]);
		const { t } = useTranslation();

		useEffect(() => {
			(async () => {
				const response = await services.services.getAll(undefined, true);
				const fetchedServices = await Promise.all(
					(response.data ?? []).map(async (service): Promise<Service> => {
						const url = await services.connections.authenticate(service.id);
						return { ...service, oauthUrl: url.data! };
					}),
				);
				setOAuthServices(fetchedServices);
			})();
		}, []);

		return (
			<dialog ref={ref} className="modal">
				<Modal title={title}>
					<>
						{errorMessage && (
							<div className="alert alert-error my-4 whitespace-pre-line opacity-100" data-cy="auth-error-message">
								<FontAwesomeIcon icon="circle-xmark" />
								<span>{errorMessage}</span>
							</div>
						)}
						<form className="space-y-4">{formChildren}</form>
						<div className="mt-5 flex justify-around">
							{oAuthServices.map((service) => (
								<button className="btn btn-ghost w-16 h-16" key={service.id}>
									<a href={service.oauthUrl}>
										<div className="avatar m-auto">
											<div className="mask mask-squircle w-16 h-16">
												<Image src={service.imageUrl} alt="Service logo" width={300} height={300} />
											</div>
										</div>
									</a>
								</button>
							))}
						</div>

						<div className="divider" />
						<p className="text-center">
							{switchMethodCtaText}
							<a className="link" onClick={onAuthTypeChange}>
								{switchMethodActionText}
							</a>
						</p>
					</>
				</Modal>
				<form method="dialog" className="modal-backdrop">
					<button onClick={onClose}>{t("actions.close")}</button>
				</form>
			</dialog>
		);
	},
);
export default AuthModal;
