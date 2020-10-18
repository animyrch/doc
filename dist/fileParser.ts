import type { DocTreeNode } from './docContainer.ts';
import { NodeHandler } from "./helpers/NodeHandler.ts";

export class FileParser {
  node?: DocTreeNode;
  buffer?: Uint8Array;
  currentTestNode?: DocTreeNode;
  private _nodeHandler: NodeHandler = new NodeHandler();

  getSections (): DocTreeNode | null {
    this._run();
    return this.node || null;
  }

  private _run () {    
    this._walkFileBuffer(0);      
  }

  private _walkFileBuffer (currentIndex: number): void {
    if (
      !this.buffer ||
      !this.node ||
      this.buffer.length === 0 ||
      currentIndex >= this.buffer.length - 1
    ) {
      return;
    }

    if (this._nodeHandler.isStartIndexForTest(this.buffer, currentIndex)) {
      currentIndex = this._nodeHandler.generateTestNode(this.node, this.buffer, currentIndex);
      currentIndex++;
      this.currentTestNode = this.node.children[this.node.children.length-1];
      currentIndex = this._walkFileBufferForTestSubsections(currentIndex);

    } else {
      currentIndex++;
    }
    this._walkFileBuffer(currentIndex); 
  }

  private _walkFileBufferForTestSubsections (currentIndex: number): number {
    if (
      !this.buffer ||
      !this.currentTestNode ||
      currentIndex >= this.buffer.length - 1 ||
      this._nodeHandler.isStartIndexForTest(this.buffer, currentIndex)
    ) {
      return currentIndex;
    }
    if (this._nodeHandler.isStartIndexForGiven(this.buffer, currentIndex)) {
      currentIndex = this._nodeHandler.generateGivenNode(this.currentTestNode, this.buffer, currentIndex);
    }
    else if (this._nodeHandler.isStartIndexForWhen(this.buffer, currentIndex)) {
      currentIndex = this._nodeHandler.generateWhenNode(this.currentTestNode, this.buffer, currentIndex);
    }
    else if (this._nodeHandler.isStartIndexForThen(this.buffer, currentIndex)) {
      currentIndex = this._nodeHandler.generateThenNode(this.currentTestNode, this.buffer, currentIndex);
    } 
    currentIndex++;
    return this._walkFileBufferForTestSubsections(currentIndex); 
  }
}
