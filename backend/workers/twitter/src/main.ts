import createTask from "./tweet/create";
import createTweet from "./tweet/create";

const areas: Record<string, () => Promise<void>> = {
    "create-tweet": createTweet,
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
