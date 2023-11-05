const translations = {
	auth: {
		login: {
			title: "Tenging",
			action: "Tenging",
			switchMethodCta: "Enginn reikningur ennþá? ",
			switchMethodAction: "Búðu til einn",
		},
		register: {
			title: "Skráning",
			action: "Skráning",
			switchMethodCta: "Ertu nú þegar með reikning? ",
			switchMethodAction: "Tenging",
			errors: {
				passwordsNotMatching: "Lykilorð eru ekki þau sömu",
			},
		},
		fields: {
			email: "Tölvupóstur",
			password: "Lykilorð",
			passwordPlaceholder: "Sláðu inn lykilorð",
		},
		callbackOAuth: "Auðkenning tókst, þú getur nú lokað þessari síðu!",
	},
	dashboard: {
		title: "Mælaborð",
		menu: {
			editor: "Búðu til verkflæði",
			dashboard: "Mælaborð",
			library: "Bókasafn",
			services: "Þjónusta",
		},
	},
	editor: {
		action: {
			title: "Aðgerð",
			description: "Atburður sem ræsir vinnuflæðið þitt",
		},
		reaction: {
			title: "Viðbrögð",
			description: "Atburður sem verkflæði keyrir þegar það er ræst",
		},
		chooseEvent: "Veldu viðburð",
		noAccountToConnect: "Enginn reikningur til að tengjast",
		accountAlreadyConnected: "Reikningur þegar tengdur",
		parameters: "Færibreytur",
		connectAccount: "Tengdu reikninginn þinn",
		back: "Til baka",
		next: "Næst",
		returnParameters: "Eftirfarandi gögn eru skilað af þessu svæði og hægt er að nota þau á því næsta:",
	},
	library: {
		title: "Verkflæði mín",
		emptyState: {
			title: "Þú hefur ekkert verkflæði",
			action: "Búðu til einn",
		},
		actions: {
			rename: {
				title: "Endurnefna verkflæðið",
				newName: "Nýtt nafn",
				successMessage: "Verkflæði breytt nafni!",
			},
		},
		name: "Nafn",
		running: "Staða",
	},
	user: {
		settings: {
			title: "Stillingar",
			email: "Tölvupóstur",
			theme: "Þema",
			language: "Tungumál",
			updateSuccessMessage: "Stillingar uppfærðar!",
		},
		menu: {
			settings: "Stillingar",
			logout: "Aftengdu",
		},
	},
	services: {
		title: "Þjónusta",
		actions: "Aðgerðir",
		reactions: "Viðbrögð",
		noArea: "Þessi þjónusta hefur engar aðgerðir eða viðbrögð",
	},
	activity: {
		title: "Virkni",
		time: "Dagsetning",
		workflow: "Verkflæði",
	},
	landing: {
		actions: {
			downloadApk: " Sækja APK",
		},
	},
	actions: {
		rename: "Endurnefna",
		delete: "EYÐA",
		save: "Að standa vörð",
		close: "Loka",
		edit: "Til að breyta",
		duplicate: "Afrit",
		copy: "Afrita",
	},
};

export default translations;
