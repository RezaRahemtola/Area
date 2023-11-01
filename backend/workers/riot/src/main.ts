import onLolMatch from "./lol/match";

const areas: Record<string, () => Promise<void>> = {
    "on-lol-match": onLolMatch,
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
