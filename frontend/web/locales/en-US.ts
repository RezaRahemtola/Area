const translations = {
	auth: {
		login: {
			title: "Login",
			action: "Login",
			switchMethodCta: "Don't have an account yet? ",
			switchMethodAction: "Create one",
		},
		register: {
			title: "Register",
			action: "Register",
			switchMethodCta: "Already have an account? ",
			switchMethodAction: "Login",
			errors: {
				passwordsNotMatching: "Passwords don't match",
			},
		},
		fields: {
			email: "Email",
			password: "Password",
			passwordPlaceholder: "Enter password",
		},
	},
	dashboard: {
		title: "Dashboard",
		menu: {
			editor: "Create workflow",
			dashboard: "Dashboard",
			library: "Library",
			services: "Services",
		},
	},
	editor: {
		action: {
			title: "Action",
			description: "An event that starts your workflow",
		},
		reaction: {
			title: "Reaction",
			description: "An event a workflow performs after it start",
		},
		chooseEvent: "Choose an event",
		noAccountToConnect: "No account to connect",
		accountAlreadyConnected: "Account already connected",
		parameters: "Parameters",
		connectAccount: "Connect your account",
		back: "Back",
		next: "Next",
		returnParameters: "The following data is returned by this area and can be used in the next one:",
	},
	library: {
		title: "My workflows",
		emptyState: {
			title: "You don't have any workflow",
			action: "Create one",
		},
		actions: {
			rename: {
				title: "Rename workflow",
				newName: "New name",
				successMessage: "Workflow successfully renamed!",
			},
		},
	},
	user: {
		settings: {
			title: "User settings",
			email: "Email",
			theme: "Theme",
			language: "Language",
			updateSuccessMessage: "Settings successfully updated!",
		},
		menu: {
			settings: "Settings",
			logout: "Logout",
		},
	},
	services: {
		title: "Services",
		actions: "Actions",
		reactions: "Reactions",
		noArea: "This service doesn't have any action or reaction",
	},
	landing: {
		actions: {
			downloadApk: " Download APK",
		},
	},
	actions: {
		rename: "Rename",
		delete: "Delete",
		save: "Save",
		close: "Close",
		edit: "Edit",
		duplicate: "Duplicate",
		copy: "Copy",
	},
};

export default translations;
