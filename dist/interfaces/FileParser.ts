import { DocTreeNode } from "./DocTreeNode.ts";

export interface FileParser {
    node?: DocTreeNode;
    buffer: Uint8Array;
    buildSections (): DocTreeNode | null;
}