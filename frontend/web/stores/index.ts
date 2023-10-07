import { atom } from "jotai";
import { Service } from "@/types/services";
import { Workflow } from "@/types/workflows";

export const servicesAtom = atom<Service[]>([]);
export const workflowsAtom = atom<Workflow[]>([]);
