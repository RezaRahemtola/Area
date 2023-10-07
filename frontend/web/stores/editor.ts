import { atom } from "jotai";
import { getEmptyEditorWorkflow } from "@/utils/workflows";
import { EditorWorkflow } from "@/types/workflows";
import { Service } from "@/types/services";

export const editorWorkflowAtom = atom<EditorWorkflow>(getEmptyEditorWorkflow());
export const editorServicesAtom = atom<Service[]>([]);
export const selectedEditorAreaAtom = atom<string | null>(null);
