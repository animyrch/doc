import { FsHandlerImpl } from "./FsHandlerImpl.ts";
import { FsHandler } from "./interfaces/FsHandler.ts";
import { FileParserImpl } from "./FileParserImpl.ts";
import { FileParser } from "./interfaces/FileParser.ts";
import { DocTreeNode } from "./interfaces/DocTreeNode.ts";
import { DocElementType } from "./enums/DocElementType.ts";


export class DocContainer {
  searchRoot: string;
  fsHandler: FsHandler;
  fileParser: FileParser;

  docTree: DocTreeNode[] = [];
  currentInsertionPoint: DocTreeNode[] = [];
  
  public static getInstance = (searchRoot: string): DocContainer => {
    return new DocContainer(
      searchRoot,
      new FsHandlerImpl,
      new FileParserImpl
    );
  }

  constructor (searchRoot: string, fsHandler: FsHandler, fileParser: FileParser) {
    this.searchRoot = searchRoot;
    this.fsHandler = fsHandler;
    this.fileParser = fileParser;
  }


  public replicateFolderStructure = async (): Promise<void> => {
    await this.fsHandler.scanFolder(this.searchRoot);
    this.fsHandler.folderStructure.map((filePath: string) => {
      const pathSegments: string[] = filePath.split('/');
      
      let nodeIndex: number = 0;
      
      for (let i = 0, len = pathSegments.length-1; i <= len; i++) {
        const currentNodeValue = pathSegments[i];
        this._setCurrentInsertionPoint({ currentIndex: i, latestInsertionIndex: nodeIndex });
        
        nodeIndex = this._buildDocTree(
          currentNodeValue, 
          this._decideInsertionMethod({ currentIndex: i, insertionLimit: len })
        );      
      }
    });
  }

  private _setCurrentInsertionPoint = ({ currentIndex, latestInsertionIndex }: { currentIndex: number, latestInsertionIndex: number }): void => {
    if (currentIndex === 0) {
      this.currentInsertionPoint = this.docTree;
    } else {
      this.currentInsertionPoint = this.currentInsertionPoint[latestInsertionIndex].children;
    }
  }

  private _decideInsertionMethod = ({ currentIndex, insertionLimit }: { currentIndex: number, insertionLimit: number }): (value: string) => number => {
    let insertionMode: (value: string) => number;
    if (currentIndex === 0) {
      insertionMode = this._insertRoot;
    } else if (currentIndex === insertionLimit) {
      insertionMode = this._insertFile;
    } else {
      insertionMode = this._insertFolder;
    } 
    return insertionMode;
  }

  private _buildDocTree = (newValue: string, cb: (value: string) => number): number => {
    let nodeIndex = this._indexInChildNodes(newValue);
    const isNewElement = nodeIndex === -1;
    if (isNewElement) {
      nodeIndex = cb(newValue); 
    }
    return nodeIndex;
  }

  private _indexInChildNodes = (value: string): number => {
    return this.currentInsertionPoint.findIndex(
       (node: DocTreeNode) => node.value === value
    );
  }

  private _insertDocNode = (value: string, type: DocElementType): number => {
    const node: DocTreeNode = {
      value,
      type,
      children: []
    }; 
    this.currentInsertionPoint.push(node);  
    return this.currentInsertionPoint.length-1;
  }

  private _insertRoot = (value: string): number => {
    return this._insertDocNode(value, DocElementType.DocRoot);
  }

  private _insertFolder = (value: string): number => {
    return this._insertDocNode(value, DocElementType.DocFolder);
  }

  private _insertFile = (value: string): number => {
    return this._insertDocNode(value, DocElementType.DocFile);
  }

  public addTestSectionsAndSubSections = () => {
    this.fileParser.buildSections()
  }
}
