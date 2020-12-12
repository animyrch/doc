import { DocElementType } from "../enums/DocElementType.ts";

export interface DocTreeNode {
    value: string,
    type: DocElementType,
    children: DocTreeNode[]
}