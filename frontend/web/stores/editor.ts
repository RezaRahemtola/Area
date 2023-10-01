import { atom } from "jotai";
import { getEmptyWorkflow } from "@/utils/workflows";
import { EditorWorkflow } from "@/types/workflows";

// eslint-disable-next-line import/prefer-default-export
export const editorWorkflowAtom = atom<EditorWorkflow>(getEmptyWorkflow());
