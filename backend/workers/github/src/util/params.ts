import { z, ZodSchema } from "zod";

export const GithubAuthSchema = z.object({
    token_type: z.string().optional(),
    access_token: z.string(),
})
type GithubAuthType = z.infer<typeof GithubAuthSchema>

export default function parseArguments<T>(schema: ZodSchema): T {
    const data: Record<string, string | GithubAuthType> = {}
    let ret: T

    for (let i = 3; i < process.argv.length; i++) {
        if (process.argv[i]!.startsWith("--")) {
            const key = process.argv[i]!.substring(2)
            const value = process.argv[i + 1]

            if (!value) {
                console.error(`Error: ${process.argv[i]} requires an argument`)
                process.exit(1)
            }
            data[key] = value
        }
    }

    try {
        if (data.auth) {
            const auth = GithubAuthSchema.parse(JSON.parse(data.auth as string))
            data.auth = auth;
        }
        ret = schema.parse(data)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
    return ret
}