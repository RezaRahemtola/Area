import {z} from "zod";
import {Octokit, RequestError} from "octokit";
import parseArguments, {GithubAuthSchema} from "../util/params.js";

const CreateIssueSchema = z.object({
    auth: GithubAuthSchema,
    owner: z.string(),
    repo: z.string(),
    title: z.string(),
    body: z.string().optional(),
    assignees: z.string().array().optional(),
    labels: z.string().array().optional(),
})
type CreateIssueType = z.infer<typeof CreateIssueSchema>

export default async function createIssue() {
    const params = parseArguments<CreateIssueType>(CreateIssueSchema)
    const octokit = new Octokit({
        auth: params.auth.access_token
    })

    try {
        await octokit.rest.issues.create({
            owner: params.owner,
            repo: params.repo,
            title: params.title,
            body: params.body,
            assignees: params.assignees,
            labels: params.labels,
        })
    } catch (e) {
        if (e instanceof RequestError && e.status === 401) {
            console.log("Auth error")
        } else {
            console.log("Other error")
        }
    }
}
