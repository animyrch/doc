import { FsHandler } from "./interfaces/FsHandler.ts";
import { expandGlob } from "https://deno.land/std/fs/mod.ts";

export class FsHandlerImpl implements FsHandler {

  folderStructure: string[] = [];

  async scanFolder(searchRoot: string):Promise<void> {
    for await (const dirEntry of expandGlob("**/*.ts", {root: Deno.cwd()+searchRoot})) {
      this.folderStructure.push(dirEntry.path.replace(Deno.cwd(), '').replace(searchRoot,''));
    }
  }

}
