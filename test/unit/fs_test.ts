import { assert, assertEquals } from "https://deno.land/std@0.64.0/testing/asserts.ts";
import { Fs } from "../../src/fs.ts";

let fsClass:Fs;
const testFolder:string = './test/mocks/testFolder/';
const given_fsIsInstantiated = () => {
  fsClass = new Fs();
}

const given_testFolderHasTwoFoldersAndTwoSubfoldersInOneOfThemAndOneFileInOneOfThem = () => {
  const folder1 = 'folder1/';
  const folder2 = '.folder2/';
  const subfolder1 = 'subfolder1/';
  const subfolder2 = 'subfolder2/';
  const file = 'file.ts';
  try {
    Deno.mkdirSync(testFolder+folder1+subfolder1, { recursive: true });
    Deno.mkdirSync(testFolder+folder1+subfolder2, { recursive: true });
    Deno.mkdirSync(testFolder+folder2, { recursive: true });
    Deno.createSync(testFolder+folder1+subfolder1+file);
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

const cleanup_scanFolderTest = async () => {
  await Deno.remove(testFolder, { recursive: true });
}

Deno.test({
  name: "FS/scanFolder",
  async fn() {
    given_fsIsInstantiated();
    given_testFolderHasTwoFoldersAndTwoSubfoldersInOneOfThemAndOneFileInOneOfThem();
    await when_scanFolder_isCalled();
    then_fsShouldStoreTestFolderStructureForExistingFiles();
    cleanup_scanFolderTest();
  },
  sanitizeResources: false,
  sanitizeOps: false
});

