import {z} from "zod";
import {Octokit, RequestError} from "octokit";
import {credentials} from "@grpc/grpc-js";
import parseArguments, {GithubAuthSchema} from "../util/params";
import {AreaBackServiceClient} from "../proto/area_back";
import "../proto/google/protobuf/struct";
import {GithubErrorData} from "../util/types";
import {onError, onReaction} from "../util/grpc";

const CreateIssueSchema = z.object({
    auth: GithubAuthSchema,
    target: z.string().optional(),
    identifier: z.string(),
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
    const client = new AreaBackServiceClient(
        params.target ?? "localhost:50050",
        credentials.createInsecure()
    )

    try {
        const res = await octokit.rest.issues.create({
            owner: params.owner,
            repo: params.repo,
            title: params.title,
            body: params.body,
            assignees: params.assignees,
            labels: params.labels,
        })
        await onReaction(client, {
            name: "github-create-issue",
            identifier: params.identifier,
            params: {
                url: res.data.url,
            }
        })
    } catch (e) {
        if (e instanceof RequestError && e.status === 401) {
            const data: GithubErrorData | undefined = e.response?.data as GithubErrorData
            await onError(client, {
                identifier: params.identifier,
                error: data.message,
                isAuthError: e.status === 401,
            })
        }
    }
}
