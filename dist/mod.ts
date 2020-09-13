import { DocContainer, DocTreeNode } from './docContainer.ts';
import { FsHandler } from './fsHandler.ts';

export class Doc {
  docContainer?: DocContainer;
  
  public run = async () => {
    const fsHandler = new FsHandler();
    await fsHandler.scanFolder();
    this.docContainer = new DocContainer(fsHandler.folderStructure); 
  }

  public getDocTree = (): DocTreeNode[] => {
    if (this.docContainer)
      return this.docContainer.docTree;
    return [];
  }
}
