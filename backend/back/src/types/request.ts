import { JwtCustomPayload } from "./jwt";

export type APIRequest = Request & { user: JwtCustomPayload };
