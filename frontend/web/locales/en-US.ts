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
	},
	library: {
		emptyState: {
			title: "You don't have any workflow",
			action: "Create one",
		},
		actions: {
			rename: {
				title: "Rename workflow",
				newName: "New name",
			},
		},
	},
	user: {
		settings: {
			title: "User settings",
		},
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
	},
};

export default translations;
