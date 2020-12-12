export interface FsHandler {
    folderStructure: string[];
    scanFolder(): Promise<void>;
}