const translations = {
	auth: {
		login: {
			title: "Connexion",
			action: "Connexion",
			switchMethodCta: "Pas encore de compte ? ",
			switchMethodAction: "En créer un",
		},
		register: {
			title: "Inscription",
			action: "Inscription",
			switchMethodCta: "Déjà un compte ? ",
			switchMethodAction: "Connexion",
			errors: {
				passwordsNotMatching: "Les mots de passe ne sont pas les mêmes",
			},
		},
		fields: {
			email: "Email",
			password: "Mot de passe",
			passwordPlaceholder: "Entrez un mot de passe",
		},
	},
	dashboard: {
		title: "Tableau de bord",
		menu: {
			editor: "Créer un workflow",
			dashboard: "Tableau de bord",
			library: "Librairie",
			services: "Services",
		},
	},
	editor: {
		action: {
			title: "Action",
			description: "Un événement qui lance votre workflow",
		},
		reaction: {
			title: "Réaction",
			description: "Un événement qu'un workflow exécutes une fois lancé",
		},
		chooseEvent: "Choisissez un événement",
	},
	library: {
		title: "Mes workflows",
		emptyState: {
			title: "Vous n'avez aucun workflow",
			action: "En créer un",
		},
		actions: {
			rename: {
				title: "Renommer le workflow",
				newName: "Nouveau nom",
				successMessage: "Workflow renommé avec succès !",
			},
		},
	},
	user: {
		settings: {
			title: "Paramètres",
			email: "Email",
			theme: "Thème",
			language: "Langue",
			updateSuccessMessage: "Paramètres mis à jour avec succès !",
		},
		menu: {
			settings: "Paramètres",
			logout: "Déconnexion",
		},
	},
	services: {
		actions: "Actions",
		reactions: "Réactions",
		noArea: "Ce service n'a pas d'action ou de réaction",
	},
	landing: {
		actions: {
			downloadApk: " Télécharger l'APK",
		},
	},
	actions: {
		rename: "Renommer",
		delete: "Supprimer",
		save: "Sauvegarder",
		close: "Fermer",
		edit: "Modifier",
	},
};

export default translations;
