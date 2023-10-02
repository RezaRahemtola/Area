import { JwtCustomPayload } from "./jwt";
import { Request } from "express";

export type APIRequest = Request & { user: JwtCustomPayload };
