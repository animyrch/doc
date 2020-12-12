import { assert } from "https://deno.land/std@0.64.0/testing/asserts.ts";
import { parse } from "https://deno.land/std@0.73.0/path/win32.ts";
import { DocElementType } from "../../dist/enums/DocElementType.ts";
import { DocTreeNode } from "../../dist/interfaces/DocTreeNode.ts";
import { FileParserImpl } from "../../dist/FileParserImpl.ts";
import { FileParser } from "../../dist/interfaces/FileParser.ts";
import { deepEqual } from "../../dist/helpers/deepEqual.ts";

const fileName = 'test/unit/fileParserImpl_test.ts';

const given_fileParser_initialised = (): FileParser => {
  return new FileParserImpl();
}

const when_buildSections_isCalledOnAFileBufferAndAFileNode = (parser: FileParser): DocTreeNode => {
  const file = Deno.openSync(fileName, { read: true });
  const myFileBuffer = Deno.readAllSync(file);
  const myFileNode: DocTreeNode = {
    value: fileName,
    type: DocElementType.DocFile,
    children: []
  };
  parser.node = myFileNode;
  parser.buffer = myFileBuffer;
  parser.buildSections();
  Deno.close(file.rid);
  return myFileNode;
}

const then_sectionsAreCreatedForEachTestCase = (updatedFileNode: DocTreeNode) => {
  const expectedNode = {
    value: fileName,
    type: "FILE",
    children: [
      { 
        value: 'name: "FileParser/buildSections",', 
        type: "SECTION", 
        children: [
          { 
            value: "fileParser_initialised();", 
            type: "GIVEN", 
            children: [] 
          },
          {
            value: "buildSections_isCalledOnAFileBufferAndAFileNode(fileParser);",
            type: "WHEN",
            children: []
          },
          {
            value: "sectionsAreCreatedForEachTestCase(updatedFileNode);",
            type: "THEN",
            children: []
          }
        ] 
      },
      { 
        value: 'name: "FileParser/buildSections second time",', 
        type: "SECTION", 
        children: [
          { 
            value: "fileParser_initialised();", 
            type: "GIVEN", 
            children: [] 
          },
          {
            value: "buildSections_isCalledOnAFileBufferAndAFileNode(fileParser);",
            type: "WHEN",
            children: []
          },
          {
            value: "sectionsAreCreatedForEachTestCase(updatedFileNode);",
            type: "THEN",
            children: []
          }
        ] 
      }
    ]
  };
  assert(deepEqual(expectedNode, updatedFileNode));
}


Deno.test({
  name: "FileParser/buildSections",
  fn () {
    const fileParser = given_fileParser_initialised();
    const updatedFileNode = when_buildSections_isCalledOnAFileBufferAndAFileNode(fileParser);
    then_sectionsAreCreatedForEachTestCase(updatedFileNode);
  },
  sanitizeOps: false,
  sanitizeResources: false
});


Deno.test({
  name: "FileParser/buildSections second time",
  fn () {
    const fileParser = given_fileParser_initialised();
    const updatedFileNode = when_buildSections_isCalledOnAFileBufferAndAFileNode(fileParser);
    then_sectionsAreCreatedForEachTestCase(updatedFileNode);
  },
  sanitizeOps: false,
  sanitizeResources: false
});