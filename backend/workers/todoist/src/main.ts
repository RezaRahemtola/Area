import createTask from "./tasks/create";
import updateTask from "./tasks/update";
import closeTask from "./tasks/close";
import reopenTask from "./tasks/reopen";
import deleteTask from "./tasks/delete";

const areas: Record<string, () => Promise<void>> = {
    "close-task": closeTask,
    "create-task": createTask,
    "delete-task": deleteTask,
    "reopen-task": reopenTask,
    "update-task": updateTask,
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
