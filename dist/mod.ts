import { DocContainer } from './DocContainer.ts';
import { DocTreeNode } from "./interfaces/DocTreeNode.ts";
import { FsHandlerImpl } from './FsHandlerImpl.ts';

export class Doc {
  docContainer?: DocContainer;
  
  public run = async (): Promise<void> => {
    const searchRoot = "/test/mocks/testFolder/";
    this.docContainer = DocContainer.getInstance(searchRoot);
    await this.docContainer.replicateFolderStructure();
    await this.docContainer.addTestSectionsAndSubSections();
  }

  public getDocTree = (): DocTreeNode[] => {
    if (this.docContainer)
      return this.docContainer.docTree;
    return [];
  }
}
