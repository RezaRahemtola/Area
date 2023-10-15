import { defineConfig } from "cypress";

export default defineConfig({
	watchForFileChanges: false,
	requestTimeout: 10000,
	e2e: {
		baseUrl: "http://localhost:3000",
		setupNodeEvents(on, config) {
			require("@cypress/code-coverage/task")(on, config);
			return config;
		},
	},
});
