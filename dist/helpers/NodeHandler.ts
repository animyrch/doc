import { DocElementType } from "../enums/DocElementType.ts";
import { DocTreeNode } from "../interfaces/DocTreeNode.ts";

export class NodeHandler {

    private _testStart = new TextEncoder().encode('Deno.test({\n');
    private _givenStart = new TextEncoder().encode('given_');
    private _whenStart = new TextEncoder().encode('when_');
    private _thenStart = new TextEncoder().encode('then_');

    isStartIndexForTest (buffer: Uint8Array, startIndex: number): boolean {
        return this._isStartIndexForNodeType(buffer, startIndex, DocElementType.DocSection);
    }

    isStartIndexForGiven (buffer: Uint8Array, startIndex: number): boolean {
        return this._isStartIndexForNodeType(buffer, startIndex, DocElementType.DocGiven);
    }

    isStartIndexForWhen (buffer: Uint8Array, startIndex: number): boolean {
        return this._isStartIndexForNodeType(buffer, startIndex, DocElementType.DocWhen);
    }

    isStartIndexForThen (buffer: Uint8Array, startIndex: number): boolean {
        return this._isStartIndexForNodeType(buffer, startIndex, DocElementType.DocThen);
    }

    private _isStartIndexForNodeType (buffer: Uint8Array, startIndex: number, nodeType: DocElementType): boolean {
        const nodeStart = this._findNodeStart(nodeType);
        for (let matchCounter = 0; matchCounter < nodeStart.length; matchCounter++) {
            if (buffer[startIndex] !== nodeStart[matchCounter]) {
                return false;
            }
            startIndex++;
        }
        return true;
    }

    private _findNodeStart (nodeType: DocElementType): Uint8Array {
        switch (nodeType) {
            case DocElementType.DocGiven:
                return this._givenStart;
            case DocElementType.DocWhen:
                return this._whenStart;
            case DocElementType.DocThen:
                return this._thenStart;
            default:
                return this._testStart;
        }
    }

    generateTestNode(parentNode: DocTreeNode, buffer: Uint8Array, startIndex: number): number {
        return this._generateNodeForNodeType(parentNode, buffer, startIndex, DocElementType.DocSection);
    }

    generateGivenNode(parentNode: DocTreeNode, buffer: Uint8Array, startIndex: number): number {
        return this._generateNodeForNodeType(parentNode, buffer, startIndex, DocElementType.DocGiven);
    }

    generateWhenNode(parentNode: DocTreeNode, buffer: Uint8Array, startIndex: number): number {
        return this._generateNodeForNodeType(parentNode, buffer, startIndex, DocElementType.DocWhen);
    }

    generateThenNode(parentNode: DocTreeNode, buffer: Uint8Array, startIndex: number): number {
        return this._generateNodeForNodeType(parentNode, buffer, startIndex, DocElementType.DocThen);
    }

    private _generateNodeForNodeType (parentNode: DocTreeNode, buffer: Uint8Array, startIndex: number, nodeType: DocElementType): number {
        const nodeStart = this._findNodeStart(nodeType);
        const extractedBuffer = this._buildNodeValue(buffer, startIndex + nodeStart.length, []);
        const testNode = this._buildNode(extractedBuffer, nodeType);
        parentNode.children.push(testNode);
        return startIndex + nodeStart.length + extractedBuffer.length;
    }
    
    private _buildNodeValue (buffer: Uint8Array, startIndex: number, extractedBuffer: Array<number>): Array<number> {
        if (this._isNewLineCode(buffer[startIndex])) {
            return extractedBuffer;
        } else {
            extractedBuffer.push(buffer[startIndex]);
            startIndex++;
            return this._buildNodeValue(buffer, startIndex, extractedBuffer);
        }
    }

    private _isNewLineCode (element: number) {
        return element === 10;
    }

    private _buildNode (extractedBuffer: Array<number>, nodeType: DocElementType): DocTreeNode {
        return {
            value: (new TextDecoder().decode(new Uint8Array(extractedBuffer))).trim(),
            type: nodeType,
            children: []
        };
    }
}