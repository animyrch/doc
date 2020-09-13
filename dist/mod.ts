import { DocContainer, DocTreeNode } from '../src/doc.ts';
import { FsHandler } from '../src/fs.ts';

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
