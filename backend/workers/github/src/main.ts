import createIssue from "./issues/create.js";
import setupWebhook from "./webhooks/setup";
import closeIssue from "./issues/close";
import reopenIssue from "./issues/reopen";

const areas: Record<string, () => Promise<void>> = {
    "close-issue": closeIssue,
    "create-issue": createIssue,
    "reopen-issue": reopenIssue,
    "setup-webhook": setupWebhook
}
async function main() {
    const job = process.argv[2];
    if (!job) {
        console.log("Error: No job specified")
        process.exit(1)
    }

    const runJob = areas[job];
    if (!runJob) {
        console.log("Error: Unknown job");
        process.exit(1)
    }

    await runJob();
}

main();
