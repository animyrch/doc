import { assert, assertEquals } from "https://deno.land/std@0.64.0/testing/asserts.ts";
import { Fs } from "../../src/fs.ts";

/** given fs instantiated, when fs.scanTestFolder is called, then fs should store test folder structure (all subfolders) in a property */

let fsClass:Fs;

const given_fsIsInstantiated = () => {
  fsClass = new Fs();
}

const given_testFolderHasTwoFoldersAndTwoSubfoldersInOneOfThemAndOneFileInOneOfThem = () => {
  const folder1 = './test/mocks/testFolder/folder1/';
  const folder2 = './test/mocks/testFolder/folder2/';
  const subfolder1 = 'subfolder1/';
  const subfolder2 = 'subfolder2/';
  const file = 'file.ts';
  try {
    Deno.mkdirSync(folder1+subfolder1, { recursive: true });
    Deno.mkdirSync(folder1+subfolder2, { recursive: true });
    Deno.mkdirSync(folder2, { recursive: true });
    Deno.createSync(folder1+subfolder1+file);
  }catch(err){
    console.log('mock folders could not be created or already exists');
  }
}

const when_scanFolder_isCalled = async () => {
  await fsClass.scanFolder();
}

const then_fsShouldStoreTestFolderStructureForExistingFiles = () => {
  const expectedFolderStructure = [
    'folder1/subfolder1/file.ts',
  ];

  assertEquals(fsClass.folderStructure, expectedFolderStructure);
}

Deno.test({
  name: "FS scanTestFolder",
  async fn() {
    given_fsIsInstantiated();
    given_testFolderHasTwoFoldersAndTwoSubfoldersInOneOfThemAndOneFileInOneOfThem();
    await when_scanFolder_isCalled();
    then_fsShouldStoreTestFolderStructureForExistingFiles();
  },
  sanitizeResources: false,
  sanitizeOps: false
});

