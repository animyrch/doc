import { assert, assertEquals } from "https://deno.land/std@0.64.0/testing/asserts.ts";
import { FileParser } from "../../dist/fileParser.ts";
import {DocTreeNode, DocElementType} from "../../dist/docContainer.ts";


const given_fileParser_initialised = (): FileParser => {
  return new FileParser();
}

const when_getSections_isCalled = (parser: FileParser): void => {
  const file = Deno.openSync('test/unit/testFile.ts', { read: true });
  const myFileBuffer = Deno.readAllSync(file);
  console.log(myFileBuffer);
  // console.log(myFileContent.toString());
  Deno.close(file.rid);

  console.log(new TextEncoder().encode('Deno.test'));

}

const then_sectionsAreCreatedForEachTestCase = () => {

}


Deno.test({
  name: "FileParser/getSections",
  fn () {
    const fileParser = given_fileParser_initialised();
    when_getSections_isCalled(fileParser);
    then_sectionsAreCreatedForEachTestCase();
  },
  sanitizeOps: false,
  sanitizeResources: false
});



Deno.test({
  name: "FileParser/getGivens",
  fn () {
    console.log("getgivens");
  },
  sanitizeOps: false,
  sanitizeResources: false 
});


Deno.test({
  name: "FileParser/getWhens",
  fn () {
    console.log("getWhens");
  },
  sanitizeOps: false,
  sanitizeResources: false
});


Deno.test({
  name: "FileParser/getThens",
  fn () {
    console.log('getThens');
  },
  sanitizeOps: false,
  sanitizeResources: false
});

const currentTestNode: DocTreeNode = {
  value: 'mockFilename',
  type: DocElementType.DocFile,
  children: []
};

const bufferText = 'Deno test element_mocked{Until this non alphanumeric character';
const expectedBufferPart = 'Deno test element_mocked';
const startIndex: number = 0;
const sectionIndex: number = 0;
Deno.test('FilParser/fillTestSection', () => {
  const fileParser = given_fileParser_initialised();
  given_fileParser_hasCertainPropertiesSet(fileParser, currentTestNode);
  when_fillTestSectionIsCalled(fileParser, sectionIndex, startIndex);
  then_testNodeIsUpdatedWithCorrectBufferPart(fileParser, sectionIndex);
});

const given_fileParser_hasCertainPropertiesSet = (fileParser: FileParser, currentTestNode: DocTreeNode) => {
  fileParser.testNode = currentTestNode;
  fileParser.currentTestSectionText = bufferText;
}

const when_fillTestSectionIsCalled = (fileParser: FileParser, sectionIndex: number, currentIndex: number): void => {
  fileParser.fillTestSection('given', sectionIndex);
}

const then_testNodeIsUpdatedWithCorrectBufferPart = (fileParser: FileParser, sectionIndex: number) => {
  assertEquals(fileParser!.testNode!.children[sectionIndex].value, expectedBufferPart);
}
