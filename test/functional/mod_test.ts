import { assert } from "https://deno.land/std@0.64.0/testing/asserts.ts";
import * as doc from "../../dist/mod.ts";

/** running doc uses default config if no config file exists at project root */

  /** default config for target should be doc.txt at project root */

  /** default config for processFilesWithExtension should consist of .js and .ts files */

/** running doc uses custom config in config file exists at project root */

  /** when custom config javascript object has resetDefaultConfig:true at root, documentor should forget about all default configs */

  /** when custom config javascript object does not have resetDefaultConfig:true at root, documentor should not forget about default configs */

  /** when processFilesWithExtension is set to .js and .txt, .js and .txt files should be processed but default .ts file should not be processed. */

  /** default config overwriting should follow the directory structure of test folder with a cascading effect */

    /** When processFilesWithExtension is set to .txt for subFolder1 property of root, this should only impact that folder (subFolder1 located in test folder root) and files that are in subdirectories of that folder  */

      /** .js and .ts files at root should be processed */

      /** .txt file at root should not be processed */

      /** .js and .ts files at subFolder1 should not be processed */

      /** .txt file at subFolder1 should be processed */

      /** .js and .ts files at subSubFolder should not be processed */

      /** .txt file at subSubFolder should be processed */ 

      /** .js and .ts files are subFolder2 should be processed */

      /** .txt file at subFolder2 should not be processed */

/** running doc on a file should generate documentation for that file */

  /**  */

/** running doc on a folder should generate documentation for all files in that folder recursively */


