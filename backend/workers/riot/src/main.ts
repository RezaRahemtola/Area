import onLolMatch from "./lol/match";
import onLolLevelUp from "./lol/level";

const areas: Record<string, () => Promise<void>> = {
    "lol-on-level-up": onLolLevelUp,
    "lol-on-game-end": onLolMatch,
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
