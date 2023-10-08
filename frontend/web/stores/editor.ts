import { atom } from "jotai";
import { getEmptyEditorWorkflow } from "@/utils/workflows";
import { EditorWorkflow } from "@/types/workflows";

export const editorWorkflowAtom = atom<EditorWorkflow>(getEmptyEditorWorkflow());
export const selectedEditorAreaAtom = atom<string | null>(null);
