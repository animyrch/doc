import { assert } from "https://deno.land/std@0.64.0/testing/asserts.ts";
import { DocContainer, DocElementType } from "../../dist/docContainer.ts";

// MOCK VALUES

const filePaths: string[] = [
  "parent/child/childschild/endFile.test.ts",
  "parent2/secondChild/aFile.test.ts",
  "parent2/secondChild/anotherFile.test.ts"
];

class FsHandler {
  folderStructure: string[] = filePaths;
  async scanFolder(): Promise<void> {
    return;
  }
}

const fsHandlerMock = new FsHandler();

// MOCKS END

Deno.test({
  name: "DocContainer/constructor", 
  async fn () {
    const doc: DocContainer = given_doc_isInitialised();
    await when_populateDocTree_isCalled(doc);
    console.log(doc);
    then_doc_parsesDocFolderStructureAndBuildsADocTreeThatFollowsFilePaths(doc);
  },
  sanitizeOps: false,
  sanitizeResources: false
});


const given_doc_isInitialised = (): DocContainer => {
  return new DocContainer(
    fsHandlerMock
  );
}

const when_populateDocTree_isCalled = async (doc: DocContainer): Promise<void> => {
  await doc.populateDocTree();
}

const then_doc_parsesDocFolderStructureAndBuildsADocTreeThatFollowsFilePaths = (doc: DocContainer): void => {
  then_docTree_propertyIsInitialised(doc);
  then_aRootElementIsCreatedForEachBeginningFolder(doc);
  then_intermediaryFoldersAreCreated(doc);
  then_terminationFilesAreCorrectlyInserted(doc);
}

const then_docTree_propertyIsInitialised = (doc: DocContainer): void => {
  assert(doc.docTree !== undefined);
}

const then_aRootElementIsCreatedForEachBeginningFolder = (doc: DocContainer): void => {
  const firstRoot = doc.docTree[0];
  const secondRoot = doc.docTree[1];
  assert(firstRoot.value === filePaths[0].split('/')[0]);
  assert(firstRoot.type === DocElementType.DocRoot);
  assert(secondRoot.value === filePaths[1].split('/')[0]);
  assert(secondRoot.type === DocElementType.DocRoot);
}

const then_intermediaryFoldersAreCreated = (doc: DocContainer): void => {
  // extracting parent branch children
  const childFolder1 = doc.docTree[0].children[0];
  // checking that the first intermediary folder of the parent branch is correctly inserted
  assert(childFolder1.value === filePaths[0].split('/')[1]);
  assert(childFolder1.type === DocElementType.DocFolder);
  // extracting second level children
  const childsChildFolder = childFolder1.children[0];
  // checking that the second intermediary folder of the parent branch is correctly inserted
  assert(childsChildFolder.value === filePaths[0].split('/')[2]);
  assert(childsChildFolder.type === DocElementType.DocFolder);

  // extracting parent2 branch children
  const childFolder2 = doc.docTree[1].children[0];
  // checking that intermediary folder of the parent2 branch is correctly inserted
  assert(childFolder2.value === filePaths[1].split('/')[1]);
  assert(childFolder2.type === DocElementType.DocFolder);
}

const then_terminationFilesAreCorrectlyInserted = (doc: DocContainer): void => {
  // extracting parent branch
  const childFolder1 = doc.docTree[0].children[0];
  // extracing termination file of the parent branch
  const terminationFile = childFolder1.children[0].children;
  // checking that the file of the parent branch is correctly inserted
  assert(terminationFile[0].value === filePaths[0].split('/')[3]);
  assert(terminationFile[0].type === DocElementType.DocFile);


  // extracting parent2 branch
  const childFolder2 = doc.docTree[1].children[0];
  // extracting termination files of the parent2 branch
  const terminationFiles = childFolder2.children;
  // checking that fist file of the parent2 branch is correctly inserted
  assert(terminationFiles[0].value === filePaths[1].split('/')[2]);
  assert(terminationFiles[0].type === DocElementType.DocFile);
  // checking that second file o the parent2 branch is correctly inserted
  assert(terminationFiles[1].value === filePaths[2].split('/')[2]);
  assert(terminationFiles[1].type === DocElementType.DocFile);
}
