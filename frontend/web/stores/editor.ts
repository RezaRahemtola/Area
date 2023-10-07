import { atom } from "jotai";
import { getEmptyWorkflow } from "@/utils/workflows";
import { EditorWorkflow } from "@/types/workflows";

export const editorWorkflowAtom = atom<EditorWorkflow>(getEmptyWorkflow());

export const selectedEditorAreaAtom = atom<string | null>(null);
