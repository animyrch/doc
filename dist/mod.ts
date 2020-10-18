import { DocContainer, DocTreeNode } from './docContainer.ts';
import { FsHandler } from './fsHandler.ts';

export class Doc {
  docContainer?: DocContainer;
  
  public run = async (): Promise<void> => {
    //const fsHandler = new FsHandler();
  //  await fsHandler.scanFolder();
//    this.docContainer = new DocContainer();i
    this.docContainer = DocContainer.getInstance();
    await this.docContainer.populateDocTree();
   // this.docContainer.parseSections(); 
  }

  public getDocTree = (): DocTreeNode[] => {
    if (this.docContainer)
      return this.docContainer.docTree;
    return [];
  }
}
