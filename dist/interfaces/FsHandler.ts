export interface FsHandler {
    folderStructure: string[];
    scanFolder(searchRoot: string): Promise<void>;
}