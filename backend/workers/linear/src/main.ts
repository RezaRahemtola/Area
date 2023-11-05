import createIssue from "./issues/create";
import createProject from "./project/create";
import createComment from "./comments/create";

const areas: Record<string, () => Promise<void>> = {
    "create-comment": createComment,
    "create-issue": createIssue,
    "create-project": createProject,
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
