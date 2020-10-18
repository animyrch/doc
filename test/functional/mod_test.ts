import { assert } from "https://deno.land/std@0.64.0/testing/asserts.ts";
import { Doc } from "../../dist/mod.ts";
// import { Doc } from "https://deno.land/x/doc@v0.1-alpha/mod.ts";
import type {DocTreeNode} from "../../dist/docContainer.ts";

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

const testFolder = './test/mocks/testFolder/';


Deno.test({
  name: 'Doc',
  async fn() {
    given_testFolderHasMultipleFoldersAndMultipleFilesInEach();
    const doc: Doc = await when_doc_isRunOnTestFolder();
    then_doc_shouldGenerateDocumentationForAllTestFilesInside(doc);
    cleanup_testFolder();
  },
  sanitizeResources: false,
  sanitizeOps: false
});


const given_testFolderHasMultipleFoldersAndMultipleFilesInEach = () => {
  const folder1 = 'folder1/';
  const folder2 = 'folder2/';
  const subFolder1 = 'subFolder1/';
  const subFolder2 = 'subFolder2/';
  const subFolder3 = 'subFolder3/';
  const file1 = 'file1.test.ts';
  const file2 = 'file2.test.ts';
  try {
    Deno.mkdirSync(testFolder+folder1+subFolder1, {recursive: true});
    Deno.mkdirSync(testFolder+folder1+subFolder2, {recursive: true});
    
    Deno.mkdirSync(testFolder+folder2+subFolder1, {recursive: true});
    Deno.mkdirSync(testFolder+folder2+subFolder2, {recursive: true});
    Deno.mkdirSync(testFolder+folder2+subFolder3, {recursive: true});

    Deno.createSync(testFolder+folder1+subFolder1+file1);
    Deno.createSync(testFolder+folder1+subFolder1+file2);
    Deno.createSync(testFolder+folder1+subFolder2+file1);
    Deno.createSync(testFolder+folder1+subFolder2+file2);


    Deno.createSync(testFolder+folder2+subFolder1+file1);
    Deno.createSync(testFolder+folder2+subFolder2+file1);
    Deno.createSync(testFolder+folder2+subFolder2+file2);
    Deno.createSync(testFolder+folder2+subFolder3+file1);
    Deno.createSync(testFolder+folder2+subFolder3+file2);
  } catch (err) {
    console.log('mock folders could not be created or already exists'); 
  }
}

const when_doc_isRunOnTestFolder = async () => {
  const doc: Doc = new Doc();
  await doc.run();
  return doc;
}

const then_doc_shouldGenerateDocumentationForAllTestFilesInside = (doc: Doc) => {
  then_doc_shoudCreateCorrectFolderStructure(doc);
  then_doc_shouldCreateCorrectSectionsInEachFile(doc);
  
}

const cleanup_testFolder = () => {
  try{
    Deno.removeSync(testFolder, {recursive: true});
  } catch (err) {
    console.log("could not remove folder");
  }
}

const then_doc_shoudCreateCorrectFolderStructure = (doc: Doc) => {

  const docTree: DocTreeNode[] = doc.getDocTree();
  assert(typeof docTree !== 'undefined');
  assert(docTree.length === 2);
  
  // extracting folder1 root branch
  const folder1Root = docTree[0];
  assert(folder1Root.value === 'folder1');
  // extracting subfolders of folder1
  const subfoldersFolder1 = folder1Root.children;
  assert(subfoldersFolder1[0].value === 'subFolder1');
  assert(subfoldersFolder1[1].value === 'subFolder2');
  // extracting termination files of folder1
  const terminationFilesSubfolder1 = subfoldersFolder1[0].children;
  const terminationFilesSubfolder2 = subfoldersFolder1[1].children;
  assert(terminationFilesSubfolder1.length === 2);
  assert(terminationFilesSubfolder1[0].value === 'file1.test.ts');
  assert(terminationFilesSubfolder1[1].value === 'file2.test.ts');
  assert(terminationFilesSubfolder2.length === 2);
  assert(terminationFilesSubfolder2[0].value === 'file1.test.ts');
  assert(terminationFilesSubfolder2[1].value === 'file2.test.ts');

  // extracting folder2 root branch
  const folder2Root = docTree[1];
  assert(folder2Root.value === 'folder2');
  // extracting subfolders of folder2
  const subfoldersFolder2 = folder2Root.children;
  assert(subfoldersFolder2[0].value === 'subFolder1');
  assert(subfoldersFolder2[1].value === 'subFolder2');
  assert(subfoldersFolder2[2].value === 'subFolder3');
  
  // extracting termination files of folder2
  const terminationFilesSubfolder21 = subfoldersFolder2[0].children;
  const terminationFilesSubfolder22 = subfoldersFolder2[1].children;
  const terminationFilesSubfolder23 = subfoldersFolder2[2].children;
  assert(terminationFilesSubfolder21.length === 1);
  assert(terminationFilesSubfolder21[0].value === 'file1.test.ts');
  assert(terminationFilesSubfolder22.length === 2);
  assert(terminationFilesSubfolder22[0].value === 'file1.test.ts');
  assert(terminationFilesSubfolder22[1].value === 'file2.test.ts');
  assert(terminationFilesSubfolder23.length === 2);
  assert(terminationFilesSubfolder23[0].value === 'file1.test.ts');
  assert(terminationFilesSubfolder23[1].value === 'file2.test.ts');
}

const then_doc_shouldCreateCorrectSectionsInEachFile = (doc: Doc) => {
  // TODO
}
