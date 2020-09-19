import { DocTreeNode, DocElementType } from './docContainer.ts';

export class FileParser {
  // input DocElementNode of type FILE

  // enter while loop, incrementing 'current element index'
    // starting from current element index, check all elements to the number of test start buffer
    // if test start found
      // add a child of type TEST to the node with the start index as value
      // enter a while loop, incrementing 'current element index' an additional time at each loop
        // enter a switch statement
          // if given start found
            // add a child of type GIVEN to the current TEST node.
            // enter a while loop, incrementing 'current element index' again once more at each loop
              // if alphanumerical value or underscore value found   

  // go out of loop when there are no elements left


  // run
    // walkFileBuffer(node, buffer, currentIndex);

  // walkFileBuffer(node, buffer, currentIndex)
    // if buffer.length === 0 -> return false; 
    // if currentIndex === buffer.length-1 -> return true
    // isCurrentIndexTestStart(buffer, currentIndex);
    // if(isCurrentIndexTestStart)
      // testIndex = addNewTest(node, currentIndex);
      // currentIndex = walkTestBuffer(node.children[testIndex), buffer, currentIndex);
    // walkFileBuffer(node, buffer, currentIndex++); 
  
  // isCurrentIndexTestStart(buffer, currentIndex)
    // for each element and index in test start buffer equivalent
      // if (element in test start buffer !== buffer[currentIndex+testStartBufferIndex])
        // return false
    // return true
  
  // walkTestBuffer(testNode, buffer, currentIndex)
    // testBufferEnded = handleTestIterationStack(buffer[currentIndex]); 
    // if (testBufferEnded) -> return currentIndex
    // currentIndex = extractGivenWhenThens(testNode, buffer, currentIndex)
    // walkTestBuffer(testNode, buffer, currentIndex++)
  
  // handleTestIterationStack(currentElement)
  // if (currentElement === openCurlyBraceletBuffer)
    // addOnTopOfStack(); // this activates stackUsed, needed for the exit condition
  // if (currentElement === closeCurlyBraceletBuffer)
    // popTopOfStock();
  // return stackUsed && stackEmpty; 
  
  
  // extractGivenWhenThens(testNode, buffer, currentIndex)
    // isGivenWhenThenStart()
    // if (isGivenWhenThenStart)  
      // currentIndex = addNewGivenWhenThen(testNode, buffer, currentIndex, 0, [given, when, then]) 
      // return currentIndex; 
    // else extractGivenWhenThens(testNode, buffer, currentIndex++);
  
  //addNewGivenWhenThen(testNode, buffer, currentIndex, givenWhenThenSearchIndex, statementStates)
    // if (buffer[currentIndex] !== givenBuffer[givenWhenThenSearchIndex])
      // statementStates.splice(statementStates.indexOf('given', 1);
    // if (buffer[currentIndex] !== whenBuffer[givenWhenThenSearchIndex])    
      // statementStates.splice(statementStates.indexOf('when', 1);
    // if (buffer[currentIndex] !== thenBuffer[givenWhenThenSearchIndex])
      // statementStates.splice(statementStates.indexOf('then', 1);
    // if (statementStates.length === 1)
      // switch statementStates[0]
        // if 'given'
          // givenIndex = addNewGiven(testNode) 
          // currentIndex = fillTestSection('given', givenIndex, currentIndex);
        // if 'when' 
          // whenIndex = addNewWhen(testNode) 
          // currentIndex = fillTestSection('when', whenIndex, currentIndex); 
        // if 'then'
          // thenIndex = addNewThen(testNode)
          // currentIndex = fillTestSection('then', thenIndex, currentIndex); 
      // return currentIndex; 
    // else 
      // addNewGivenWhenThen(testNode, buffer, currentIndex++, givenWhenThenSearchIndex++, statementStates)
  // 

  

  testNode?: DocTreeNode;
  currentTestSectionText?: string;
  currentTextSectionPointer: number = 0;
  buffer?: Uint8Array;

  public fillTestSection = (sectionType: string, sectionIndex: number, sectionContent: string = ''): boolean => {
    if (this.currentTestSectionText) {
      if(this.isAllowedCharacter(this.currentTestSectionText[this.currentTextSectionPointer])) {
        sectionContent += this.currentTestSectionText[this.currentTextSectionPointer++];
        this.fillTestSection(sectionType, sectionIndex, sectionContent);
      } else {
        this.insertTestSectionContent(sectionIndex, sectionContent, sectionType);
      }
    }
    return true; 
  }

  private isAllowedCharacter = (element: string): boolean => {
      const code = element.charCodeAt(0);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123) && // lower alpha (a-z)
          code !== 32 && code !== 95) { // space and underscore
        return false;
      }
    return true;
  }

  private insertTestSectionContent = (sectionIndex: number, sectionContent: string, sectionType: string): void => { 
    if (this.testNode) {
      this.testNode.children[sectionIndex] = {
        value: sectionContent,
        type: DocElementType.DocGiven,
        children: []
      };

      if (sectionType === 'when') {
        this.testNode.children[sectionIndex].type = DocElementType.DocWhen;
      } else if (sectionType === 'then') {
       this.testNode.children[sectionIndex].type = DocElementType.DocThen;
      }
    }
  }

}
