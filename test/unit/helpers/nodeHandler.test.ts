import { assert } from "https://deno.land/std@0.64.0/testing/asserts.ts";
import { DocElementType, DocTreeNode } from "../../../dist/docContainer.ts";
import { NodeHandler } from '../../../dist/helpers/NodeHandler.ts';


const testStart = "Deno.test({\n";

Deno.test({
    name: "TestNode/isStartIndex/valid inputs",
    fn () {
        const { testBuffer, testIndex } = given_aBufferThatHasATestStartAtGivenCurrentIndex();
        const checkResult = when_isStartIndex_isCalled(testBuffer, testIndex);
        then_checkResultShouldBeTrue(checkResult);
    },
    sanitizeOps: false,
    sanitizeResources: false
});

const given_aBufferThatHasATestStartAtGivenCurrentIndex = () => {
    const simpleText = "some text ";
    return {
        testBuffer: new TextEncoder().encode(`${simpleText}${testStart}`),
        testIndex: simpleText.length
    };
}

const when_isStartIndex_isCalled = (testBuffer: Uint8Array, testIndex: number): boolean => {
    const nodeHandler = new NodeHandler();
    return nodeHandler.isStartIndexForTest(testBuffer, testIndex);
}

const then_checkResultShouldBeTrue = (checkResult: boolean): void => {
    assert(checkResult);
}



Deno.test({
    name: "TestNode/isStartIndex/invalid inputs",
    fn () {
        const { testBuffer, testIndex } = given_aBufferThatDoesNotHaveATestStartAtGivenCurrentIndex();
        const checkResult = when_isStartIndex_isCalled(testBuffer, testIndex);
        then_checkResultShouldNotBeTrue(checkResult);
    },
    sanitizeOps: false,
    sanitizeResources: false
});

const given_aBufferThatDoesNotHaveATestStartAtGivenCurrentIndex = () => {
    const simpleText = "some text ";
    return {
        testBuffer: new TextEncoder().encode(`${simpleText}${testStart}`),
        testIndex: 0
    };
}

const then_checkResultShouldNotBeTrue = (checkResult: boolean): void => {
    assert(checkResult !== true);
}



Deno.test({
    name: "TestNode/generate",
    fn () {
        const { parentNode, testBuffer, testIndex, testValue } = given_aParentNodeABufferAndIndexForTestStartInTheBuffer();
        const generateResult = when_generate_isCalled(parentNode, testBuffer, testIndex);
        then_parentNodeShouldBeUpdatedWithNewTestChildNode(parentNode, testValue);
        then_resultShouldBeIndexInBufferAfterSectionValue(generateResult, testIndex + testStart.length + testValue.length);
    },
    sanitizeOps: false,
    sanitizeResources: false
});

const given_aParentNodeABufferAndIndexForTestStartInTheBuffer = () => {
    const simpleText = "some text ";
    const testValue = "TestName/moreDetail";
    const remainingContent = "\nremaining";
    return {
        parentNode: {
            value: 'filePath',
            type: DocElementType.DocFile,
            children: []
        },
        testBuffer: new TextEncoder().encode(`${simpleText}${testStart}${testValue}${remainingContent}`),
        testIndex: 10,
        testValue
    };
}

const when_generate_isCalled = (parentNode: DocTreeNode, testBuffer: Uint8Array, testIndex: number): number => {
    const nodeHandler = new NodeHandler();
    return nodeHandler.generateTestNode(parentNode, testBuffer, testIndex);
}

const then_parentNodeShouldBeUpdatedWithNewTestChildNode = (parentNode: DocTreeNode, testValue: string): void => {
    assert(parentNode.children.length === 1);
    assert(parentNode.children[0].type === DocElementType.DocSection);
    assert(parentNode.children[0].value === testValue);
}

const then_resultShouldBeIndexInBufferAfterSectionValue = (generateResult: number, expectedIndex: number): void => {
    assert(generateResult === expectedIndex);
}

