/** WQElements. Part of GeneriQ WQ. @author: Wietse Zuyderwyk */

// WQElements. Part of GeneriQ WQ.
// @author: Wietse Zuyderwyk


  /* // Todo: dynamic infix and postfix functions/operators, native objects and methods (i.e. (more) generic data and function syntax), (more types and) type checking and qualification/creativity 
  // [20131031-1600;20131031-1630] escape ", ( and ) in DOM-node serialisation strings (also in attribute names/values)
  // [20131031-1630;20131031-1730] make sure that parser ignores \", \( and \) in strings
  // Add line-numbers in syntax/parse error messages
  // BNF + any (formal) language to WQ converter (will be different parser (type); context-sensitive-like )
  // Stop leaking; use of <base,path> weak references, ARP and further reference/data compartmentation and more complex data as one
  // data type (runtime/GC side-stepping)
  // And... rewrite and optimisation!
  
  // Problems: none (known) at this time.
  // Ref001: ...
  
  // Ref000: where I stopped working last time
  */
  
  wqDOMNodeExtension: function (stringWithChildrenToBeAdded,updateActualNode,childrenShouldBeRemovedNotAdded,elementsWQPropertyRepresentation) {
    if (typeof(stringWithChildrenToBeAdded) === "string" || typeof(stringWithChildrenToBeAdded) === "object") stringWithChildrenToBeAdded = stringWithChildrenToBeAdded.toString();
    var serialisationsOfChildren = "";
    var isFirstChild = true;
    
    Array.prototype.forEach.apply(this.childNodes,[function (node) {
      node.wq = ((node.nodeType === 3)?function () { return "text(\"" + this.nodeValue.replace(/\"/g,"\\\"").replace(/\(/,"\\(").replace(/\)/g,"\\)") + "\")"; }:(new WQElements).wqDOMNodeExtension)
      serialisationsOfChildren += ((isFirstChild)?"":",") + node.wq();
      isFirstChild = false;
    }]);
    
    
    var attributeSerialisation = "";
    var isFirstAttribute = true;
    
    Array.prototype.forEach.apply(this.attributes,[function (attr) {
      attributeSerialisation += ((isFirstAttribute)?"\"":",\"") + attr.name.replace(/\"/g,"\\\"").replace(/\(/g,"\\(").replace(/\)/,"\\)") + "=" + attr.value.replace(/\"/g,"\\\"") + "\"";
      isFirstAttribute = false;
    }]);
    
    if(serialisationsOfChildren && serialisationsOfChildren[0] && stringWithChildrenToBeAdded && stringWithChildrenToBeAdded[0] && !childrenShouldBeRemovedNotAdded) stringWithChildrenToBeAdded = "," + stringWithChildrenToBeAdded;
    
    if(updateActualNode && stringWithChildrenToBeAdded) {
      (new WQElements).evaluate("replace(\"" + this.getAttribute("id") + "\"," + (
        (this.nodeType === 1)?"element(\""+this.nodeName+"\",["+attributeSerialisation+"],["+((!childrenShouldBeRemovedNotAdded)?serialisationsOfChildren+stringWithChildrenToBeAdded:serialisationsOfChildren.replace(stringWithChildrenToBeAdded,""))+"])":
        (
          (this.nodeType === 3)?"text(\""+this.nodeValue+"\")":"text(\"Only Element and Text Nodes are implemented as of yet.\")"
        )
      ) + ")"
      ,
      undefined,undefined,
      elementsWQPropertyRepresentation);

    }

    // Return the old or the new?: stringWithChildrenToBeAdded = undefined;
    if(!stringWithChildrenToBeAdded)
      return (
        (this.nodeType === 1)?"element(\""+this.nodeName+"\",["+attributeSerialisation+"],["+serialisationsOfChildren+"])":
        (
          (this.nodeType === 3)?"text(\""+this.nodeValue+"\")":"text(\"Only Element and Text Nodes are implemented as of yet.\")"
        )
      ); else
      
      return (
        (this.nodeType === 1)?"element(\""+this.nodeName+"\",["+attributeSerialisation+"],["+((!childrenShouldBeRemovedNotAdded)?serialisationsOfChildren+stringWithChildrenToBeAdded:serialisationsOfChildren.replace(stringWithChildrenToBeAdded,""))+"])":
        (
          (this.nodeType === 3)?"text(\""+this.nodeValue+"\")":"text(\"Only Element and Text Nodes are implemented as of yet.\")"
        )
      );
  }, // could've used .reduce() but does only work on ES5 engines (!=JScript) 
  
  WQinstances: new Array(null,null,null,null,null,null,null), // WQProperty, WQElements, WQStyle, WQEvents, WQParsers, WQRuntimes, WQMessages
  // Use of constructor instantiation without assignment (construct and immediate GC-die); use of references, is fine(?)
  // No, should all be replaced (if possible)
  // And constructors should always be called as functions; let the module decide what's needed (mostly given the arguments)
  
  WQconstructors: new Array(null,null,null,null,null,null,null),
    
  WQprototypes: new Array(null,null,null,null,null,null,null),
  
  modelObjectSerialiser: function () {
    return { toString: function () {
      if (typeof(this) === "string") return "text(" + String.prototype.toString.apply(this) + ")";
      
      var attributes = new Array();
      var elements = new Array();
    
      for (property in this) {
        if (this[property] !== this.constructor.prototype[property]) {
          if (parseInt(property).toString() !== property && "constructor" !== property && -1 === property.indexOf("$x_"))
            if (property[0] === "_") { attributes.push(new Array(property.substr(1),this[property])); }
              else { elements.push(new Array(
                property,
                (
                  (this[property].toString && this[property].toString === String.prototype.toString)?
                    "text(\"" + this[property] + "\")"
                      :
                        ((this[property].$x_name = property) && (new WQElements).modelObjectSerialiser().toString.apply(this[property]))
                )
              ));
            }
        }   
      }
      var isNotFirstAttribute = false;
      var isNotFirstElement = false;
      var elementString = "";
      var attributeString = "";
      
      attributes.forEach(function (attributePair,index) {
        attributeString += isNotFirstAttribute = ((isNotFirstAttribute)?",\"":"\"") + attributePair[0] + "=" + attributePair[1] + "\"";
      });
      
      elements.forEach(function (elementPair,index) {
        elementString += isNotFirstElement = ((isNotFirstElement)?",":"") + elementPair[1];
      });
      
      return (
        (this.$x_name)? 
          "element(\"" + this.$x_name + "\","
            :
              ""
        )
        +
        "[" + attributeString
        +
        "],[" + elementString
        +
        "])";
    } };
  },
  
  $x_states: new Array(
    function (expression, newStateNotEvaluation,thisArg) { return ((newStateNotEvaluation)?1:(expression)); },
    function (acc,newValue) { return parseInt(acc) + parseInt(newValue); },
    function (acc,newValue) { return parseInt(acc) * parseInt(newValue); },
    function (expression) { if (expression !== null) alert(expression); return 0; },
    function (identifier, newStateNotEvaluation) { if(newStateNotEvaluation) return 0; if(!this.identifierAssociatedValue[identifier]) throw new this.ParseError(3,identifier);
      return this.identifierAssociatedValue[identifier]; },
    function (assignmentStatement, newStateNotEvaluation) { if(newStateNotEvaluation) return 0; var tuple = assignmentStatement.split(","); if (tuple.length !== 2) throw new this.ParseError(4,"2"); else if(this.isValidIdentifier(tuple[0])) this.identifierAssociatedValue[tuple[0]] = tuple[1]; return tuple[1]; },
    function (IDAndNode, newStateNotEvaluation) { if(newStateNotEvaluation) return 0; var tuple = IDAndNode.split(","); if (tuple.length !== 2) throw new this.ParseError(4,"2"); else document.getElementById(tuple[0]).appendChild(this.$x_nodes[tuple[1]]); return 0; },
    function (elementDescription, newStateNotEvaluation) {
      if(newStateNotEvaluation) return 0;
      
      var arrays = elementDescription.split("\":#*!\"");
      
      if (!arrays.length > 3) throw new this.ParseError(5,"1"); else {
        var elm = document.createElement(arrays[0].split(",")[0]);
        
        elm.wq = this.wqDOMNodeExtension;
        
        var wq = this;
        
        arrays[2].split(",").forEach(function (possibleNodeReference,index) {
          if(index !== 0 && index !== (this.length - 1) && wq.$x_nodes[possibleNodeReference]) elm.appendChild(wq.$x_nodes[possibleNodeReference]);
        });
        
        arrays[1].substr(1,arrays[1].length - 2).split(",").forEach(function (attributeNameAndValue) {
          var attributeKeyValuePair = attributeNameAndValue.split("=");
          if(attributeKeyValuePair.length === 2) elm.setAttribute(attributeKeyValuePair[0],attributeKeyValuePair[1]);
          
        });
        
        this.$x_nodes.push(elm);
        if (this.elementsWQPropertyRepresentation) this.elementsWQPropertyRepresentation = this.elementsWQPropertyRepresentation.add(this.createNodeRepresentation(elm));
        return this.$x_nodes.length - 1;
      }
    },

    function (elementDescription, newStateNotEvaluation) { if(newStateNotEvaluation) return 0; var tuple = elementDescription.split(","); if (tuple.length !== 1) throw new this.ParseError(4,"1"); else { var elm = document.createTextNode(tuple[0]); this.$x_nodes.push(elm); if (this.elementsWQPropertyRepresentation) this.elementsWQPropertyRepresentation = this.elementsWQPropertyRepresentation.add(this.createNodeRepresentation(elm)); return this.$x_nodes.length - 1; } },
    function (IDAndNode, newStateNotEvaluation) { if(newStateNotEvaluation) return 0; var tuple = IDAndNode.split(","); if (tuple.length !== 2) throw new this.ParseError(4,"2"); else document.getElementById(tuple[0]).parentNode.replaceChild(this.$x_nodes[tuple[1]],document.getElementById(tuple[0])); return 0; }
  ),
  // Host objects may behave unexpectedly, so better create a copy(-ready version; copying done by WQProperty) less generically while also adding some WQElements methods
  createNodeRepresentation: function (node,createModel) { // Two types of representation; default (createModel!==true) for use with wqNodeExtension(), otherwise for use with $x_model
    if (createModel === true) {
      var nodeRepresentation;
      
      if (node.nodeType === 3) { nodeRepresentation["text"] = node.nodeValue; return nodeRepresentation; }
      
      if (node.nodeType === 1) {
        nodeRepresentation[node.nodeName] = { }; // Add $x_name, $x_parent, $x_referent and all attributes and children (recursive call to this function with createModel===true; Ref000
      }
      
      return; // undefined; need to implement all node types
    }
    
    var nodeRepresentation = { $nodeName: node.nodeName, $nodeValue: node.nodeValue, $nodeType: node.nodeType, $childNodes: node.childNodes, $attributes: node.attributes, $x_wq: (new WQElements).wqDOMNodeExtension, $getAttribute: function (attrName) { return this.$x_referent.getAttribute(attrName); }, $x_referent: node };
    
    nodeRepresentation[node.nodeName.toLowerCase()] = node;
    
    if (node.attributes) Array.prototype.forEach.apply(node.attributes,[function (attr) { if (attr) {
      nodeRepresentation["$attr"] = nodeRepresentation["_" + attr.nodeName] = attr;
      nodeRepresentation["_" + attr.nodeName][0] = nodeRepresentation["_" + attr.nodeName];
      nodeRepresentation["_" + attr.nodeName][1] = attr.value;
      nodeRepresentation["_" + attr.nodeName].toString = function () { return this[1]; }; } }]);
    
    return nodeRepresentation;
  },
  
  $x_nodes: new Array(),
  
  preprocess: {
    // Needs some cleaner implementation; probably two passes
    replaceWhitespaceExpressionDelimitersAndCommas: function (text) {
      var noPlaceForAComma = true;
      var isFirstWhitespaceCharacterDelimiterOrComma = true;
      var textWithoutWhitespace = new String();
      var isString = false;
      Array.prototype.forEach.apply(text,[function (character, index, object) {
        if (character === "\"" && object[index - 1] !== "\\") isString = ((isString)?false:true);
        if (character === ")" && textWithoutWhitespace.substr(-1) === ",") textWithoutWhitespace = textWithoutWhitespace.substr(0,textWithoutWhitespace.length - 1);
        if (character === " " || character === "," || character === "(" || character === ")" || character === "\t" || character === "\r" || character === "\n")
          { if (isFirstWhitespaceCharacterDelimiterOrComma || character === "(" || character === ")") { textWithoutWhitespace += ((character === "(")?"(":((character === ")")?")":((noPlaceForAComma)?"":((!isString)?",":character)))); isFirstWhitespaceCharacterDelimiterOrComma =  (character === "(" || character === ")"); noPlaceForAComma = (character === "("); } }
          else { textWithoutWhitespace += character; isFirstWhitespaceCharacterDelimiterOrComma = true; noPlaceForAComma = (object[index + 1] === ")"); }
      }]);
      
      return textWithoutWhitespace;
    }
  },
  
  separateExpressionTokens: function (expression) {
    result = new String();
    var isString = false;
    Array.prototype.forEach.apply(expression,[function (character, index, obj) {
      if((obj[index + 1] && this.areTokenStringSetMembersOfSameKind(character, obj[index + 1])) || !obj[index + 1] || isString || character === "\"")
        { result += character; if(character === "\"" && obj[index - 1] !== "\\") isString = ((isString)?false:true); }
        else if(obj[index + 1] && !isString) result += character + ",";
    },this]);
    
    result = result.split(",");
    
    this.currentTypes = new Array();
    
    Array.prototype.forEach.apply(result,[function (tokenString,index,obj) { obj[index] = this.determineType(tokenString); },this]);
    
    return result.join(",");
  },

  determineType: function (tokenString) { // Types: 0=false, 1=true, 2=integer, 3=string, 4=floating-point number, 5=array delimiter (or at least ":#*!ar@@@"; a 'mere' hint; so much else could be meant by it ;-) )
    if (tokenString[tokenString.length - 1] === "]") { tokenString = tokenString.substr(0,tokenString.length - 1); }
    if (tokenString === "\":#*!ar@@@\"") { this.currentTypes.push(5); return "\":#*!\""; } // this should (also) be dependent on state
    if (tokenString[0] === "\"" && tokenString[tokenString.length - 1] === "\"") { this.currentTypes.push(3); tokenString = tokenString.replace(/\\\(/g,"(").replace(/\\\)/g,")").replace(/\\\"/g,"\""); return tokenString.substr(1, tokenString.length - 2); }
    if (tokenString[0] === "[" && tokenString[tokenString.length - 1] === "]") { this.currentTypes.push(5); return tokenString; }
    if (tokenString === parseInt(tokenString).toString()) { this.currentTypes.push(2); return tokenString; }
    if (tokenString === "false") { this.currentTypes.push(0); return 0; }
    if (tokenString === "true") { this.currentTypes.push(1); return 1; }
    if(tokenString[0] && this.isValidIdentifier(tokenString)) {
      if (this.identifierAssociatedValue[tokenString]) return this.determineType(this.identifierAssociatedValue[tokenString]);
        else throw new WQElements.prototype.ParseError(3,tokenString); }
      else { this.currentTypes.push(((tokenString.toString()[0])?1:0)); return tokenString; }
  },
  
  signatureTypeCheck: function (functionName,signature) { },
  
  functionSignatureTypes: new Array(),
  
  tokenStringMemberSetConditions: [
    [[65,90],[97,122]],
    [[44],[48,57]]
  ],
  
  // Needs stricter adherence to conditions
  areTokenStringSetMembersOfSameKind: function(tokenCharacter1,tokenCharacter2) { return (tokenCharacter1.charCodeAt(0) === this.tokenStringMemberSetConditions[1][0][0]) || (tokenCharacter2.charCodeAt(0) === this.tokenStringMemberSetConditions[1][0][0]) || !((tokenCharacter1.charCodeAt(0) >= this.tokenStringMemberSetConditions[0][0][0] && tokenCharacter2.charCodeAt(0) <= this.tokenStringMemberSetConditions[1][1][1])
    || (tokenCharacter2.charCodeAt(0) >= this.tokenStringMemberSetConditions[0][0][0] && tokenCharacter1.charCodeAt(0) <= this.tokenStringMemberSetConditions[1][1][1])); },

  arrayConstructorWithBetterSerialiser: function() { /*  ES3 doesn't allow setting the internal prototype after Object creation ( ; here in the constructor), so I use init. */ },

  $x_delimiters: new Array(new Array("(",")")),

  determineStateAndIdentifierLength: function (currentState, currentlyParsedSerialisation) {
    var currentSerialisationSubstring = "";
    for(var i = currentlyParsedSerialisation.length - 1; i >= 0; i--) {
      if(this.implicitlyAndExplicitlyDelimitingCharactersPerState[currentState].indexOf(currentlyParsedSerialisation[i]) === -1)
      currentSerialisationSubstring += currentlyParsedSerialisation[i]; else break;
    }

    var state = undefined;
    var candidateIdentifier = new Array();
    candidateIdentifier.reversed = new String(currentSerialisationSubstring);
    Array.prototype.forEach.apply(candidateIdentifier.reversed,[function (character,index) { Array.prototype.push.apply(this,[this.reversed[this.reversed.length - index - 1]]); }, candidateIdentifier]);
    candidateIdentifier = candidateIdentifier.join("");
    
    if (candidateIdentifier[0] === "\"") { candidateIdentifier = ""; } // evaluate parentheses-enclosed expressions in strings as normal
    
    this.identifiers.forEach(function (identifier,index) { if(identifier === candidateIdentifier) state = this.identifierAssociatedStates[index](identifier,currentState,this); }, this);
    if (state === undefined) throw new this.ParseError(3,candidateIdentifier);

    return [state,currentSerialisationSubstring.length,candidateIdentifier];
  },

  identifiers: ["","*","+","=","mul","add","say","var","attach","element","text","replace","and","or","method"], // Needs to be ordered from longest to shortest for value-overlapping character strings

  implicitlyAndExplicitlyDelimitingCharactersPerState: ["0123456789,()[]\\"],

  identifierAssociatedStates: [
    function (identifier,currentState) { return 0; },
    function (identifier,currentState) { return 2; },
    function (identifier,currentState) { return 1; },
    function (identifier,currentState) { return 5; },
    function (identifier,currentState) { return 2; },
    function (identifier,currentState) { return 1; },
    function (identifier,currentState) { return 3; },
    function (identifier,currentState) { return 4; },
    function (identifier,currentState) { return 6; },
    function (identifier,currentState) { return 7; },
    function (identifier,currentState) { return 8; },
    function (identifier,currentState) { return 9; }
  ],
  
  identifierAssociatedArityAndPositioning: [
    { identifier: "a", left: 0, right: 1 }
  ],
  
  identifierAssociatedValue: {
    x: "\"undefined\"",
    y: 80,
    "[": "\":#*!ar@@@\"", // bit of a hack, but most preferable (for now); this allows for worse type and arity checking but better syntax checking inside arrays without complicating things
    "]": "\":#*!ar@@@\""
  },
  
  isValidIdentifier: function (candidateIdentifier) {
   return (candidateIdentifier[0].charCodeAt(0) > 64 && candidateIdentifier.indexOf("\\") === -1);
  },

  currentTypes: null,

  $_qualify: function () { },

  ExpressionStart: 1,

  ExpressionEnd: 2,

  ParseErrorMessages: new Array(
    "Failed to parse. {}",
    "Syntax error: unbalanced expression delimiters. {}",
    "Syntax error: cannot end an expression with delimiter type not used in starting it. {}",
    "Parse error: unknown identifier: {}",
    "Parse error: function takes exactly {} arguments.",
    "Incorrect number of arrays used in function call: at least {} non-empty required.",
    "Argument types do not correspond with function signature types. {}"
  ),

  ParseError: function(type,addedRemark) { this.message = ((type)?(new WQElements).ParseErrorMessages[type]:(new WQElements).ParseErrorMessages[0]).replace("{}",((addedRemark)?addedRemark:"")); this.toString = function() { return "ParseError"; }; },

  test: function () {
    try { this.evaluate("\
    attach(\"main\",element(\"div\",[\"id=test\",\"class=test\"],[text(\"\\\"natural language = (x) \\(x\\) and child nodes should become last arguments; after attributes and style properties\")]))"); } catch(ex) { console.log(ex.message); }
    var x = new (new WQElements).arrayConstructorWithBetterSerialiser();
    document.querySelectorAll("div")[1].setAttribute("id","child");
    // alert(document.querySelectorAll("div")[1].wq());
    document.getElementById("main").wq = this.wqDOMNodeExtension;
    document.getElementById("main").setAttribute("class","fun");
    // alert(document.querySelectorAll("div")[0].wq());
    this.evaluate("attach(\"copy\"," + document.querySelectorAll("div")[1].wq("element(\"span\",[\"style=color: red\"],[text(\"Hi\\\"!\")])") + ")");
    this.evaluate("replace(\"test\"," + document.querySelectorAll("div")[1].wq("element(\"span\",[\"style=color: red\"],[text(\"Hi\\\"!\")])") + ")");
    // alert(document.querySelectorAll("div")[1].wq("element(\"SPAN\",[],[text(\"Hi\"!\")])",true));
    // alert(document.querySelectorAll("div")[1].wq("element(\"SPAN\",[\"style=color: red\"],[text(\"Hi\"!\")])",true,true));
    // alert(document.querySelectorAll("div")[1].wq(document.querySelector("span").wq(),true,true));
  },
  
  hasBeenPreprocessed: false,
  
  elementsWQPropertyRepresentation: null,

  evaluate: function (serialisation,state,delimiters,elementsWQPropertyRepresentation) {
    
    // Todo: optimise by recomputing character offsets of delimiters after evaluation and re-using recomputed parse tree.
    
    var WQinstance = this;
    
    if (elementsWQPropertyRepresentation !== undefined) this.elementsWQPropertyRepresentation = elementsWQPropertyRepresentation;
    
    if(!this.hasBeenPreprocessed) {
      for(property in this.preprocess) { serialisation = this.preprocess[property](serialisation); }
      WQinstance.hasBeenPreprocessed = true;
    }
    
    (serialisation = new String(serialisation)).expressions = new Array(new Array(null,null,null,null));
    serialisation.WQinstance = WQinstance;
    serialisation.expressionDelimiterCounts = new Array(0,0); // Could be [0,0], but old Mozilla browsers only construct with the 'new' statement
    serialisation.expressionNestingLevels = 0;
    
    if(!delimiters) delimiters = this.$x_delimiters[0];
    
    var currentState;
    state = this.$x_states[(currentState = ((!state)?0:state))];
    
    this.$x_states.WQinstance = this;
    
    if (currentState === 1 || currentState === 2) {
      var nums = new Array(); serialisation = this.separateExpressionTokens(serialisation); serialisation.split(",").forEach(function (tokenString) { nums.push(tokenString); }); return nums.reduce(this.$x_states[currentState]);
    } else if (currentState === 4 || currentState === 5) { return state.apply(WQinstance,[serialisation,state(null,true,this)]); } // Variable assignment and reference
        else if (currentState !== 0) { serialisation = this.separateExpressionTokens(serialisation); return state.apply(WQinstance,[serialisation,state(null,true,this)]); };
    
    
    Array.prototype.forEach.apply(serialisation,[function (character,i,obj) {
      if((!obj[i - 1]) || obj[i - 1] !== "\\") {
      if(character === /* strict eq. op. may be/is faster */ delimiters[1]) {
        if(obj.expressions.length === 1) throw new (new WQElements).ParseError(2);
        
        obj.expressions[obj.expressions.length - 1][0] = i;
        obj.expressions[obj.expressions.length - 1][1] = WQElements.prototype.ExpressionEnd;
        obj.expressions[obj.expressions.length - 1][2] = obj.expressionDelimiterCounts[0] - obj.expressionDelimiterCounts[1];
        obj.expressions.push(new Array(null,null,null,null));
        obj.expressionDelimiterCounts[1] += 1;
        obj.expressionNestingLevels = ((obj.expressionDelimiterCounts[0] - obj.expressionDelimiterCounts[1] + 1 > obj.expressionNestingLevels)?(obj.expressionDelimiterCounts[0] - obj.expressionDelimiterCounts[1] + 1):(obj.expressionNestingLevels));
        
      } else
        if(character === /* strict eq. op. may be faster */ delimiters[0]) {
          
          obj.expressionDelimiterCounts[0] += 1;
          obj.expressions[obj.expressions.length - 1][0] = i;
          obj.expressions[obj.expressions.length - 1][1] = WQElements.prototype.ExpressionStart;
          obj.expressions[obj.expressions.length - 1][2] = obj.expressionDelimiterCounts[0] - obj.expressionDelimiterCounts[1];
          obj.expressions[obj.expressions.length - 1][3] = obj.WQinstance.determineStateAndIdentifierLength(currentState,obj.substr(0,i));
          obj.expressions.push(new Array(null,null,null,null));
          
        } }
      
    }]);
    if (serialisation.expressionDelimiterCounts[0] !== serialisation.expressionDelimiterCounts[1]) throw new this.ParseError(1);
    serialisation.endOfState = ((serialisation.expressionDelimiterCounts[0] === 0)?true:false);
    
    
    
    // Evaluate further on the highest nesting level; the most nested/deep subexpressions, and substitute each such expression with its evaluation (result)
    var mostNestedSubExpressions = new Array(new Array(0,0,"",0));
    serialisation.expressions.forEach (function (token) {
      if(token[2] === serialisation.expressionNestingLevels && token[1] === (new WQElements).ExpressionStart) {
        mostNestedSubExpressions[mostNestedSubExpressions.length - 1][0] = token[0];
        mostNestedSubExpressions[mostNestedSubExpressions.length - 1][3] = token[3];
      }
      else if(token[2] === serialisation.expressionNestingLevels && token[1] === (new WQElements).ExpressionEnd) {
          mostNestedSubExpressions[mostNestedSubExpressions.length - 1][1] = token[0];
          mostNestedSubExpressions[mostNestedSubExpressions.length - 1][2] =
            serialisation.substr(
              mostNestedSubExpressions[mostNestedSubExpressions.length -1][0],
              mostNestedSubExpressions[mostNestedSubExpressions.length -1][1] - mostNestedSubExpressions[mostNestedSubExpressions.length - 1][0] + 1
            );
          mostNestedSubExpressions.push(new Array(0,0,"",0));
        }
    });
    
    mostNestedSubExpressions.forEach(function(expression) {
      if(expression[1] == 0) return;
      serialisation = serialisation.replace(expression[3][2] + expression[2],state(WQinstance.evaluate(expression[2].substr(1,expression[2].length - 2),expression[3][0]),false,WQinstance));
      
    });

    return this.evaluate(serialisation,(serialisation.endOfState)?state(null,true,this):currentState);
    
  },

  init: function () {
    /* For 3rd edition browsers, add forEach to the Array prototype (non-internal; becomes internal after Array construction) Object. */
    /* Possible improvements: add to "func" an argument position for handing over return values for all calls except the first and last;
      last one could instead just return and b returned by forEach; works as an accumulator and makes reduce redundant; more generic/GeneriQ.
      It should then also have a default return value if there are no array membeers.
      
      Note: doesn't work on sparse arrays; could be "fixed", but I don't use them anyway. Bad practice to do (except for hashing/indexing, but there forEach shouldn't be used on them or a simple test for undefined will do.). */
      
    this.global = WQ.$x_parent;
    
    if(!Array.prototype.forEach) Array.prototype.forEach = function (func, thisArg) {
      if(!thisArg) thisArg = this;
      if(!thisArg[0] || !thisArg.length) return;
      
      for(var i = 0; i < thisArg.length; i++) func.apply( ((arguments["2"])?arguments["2"]:window) ,[(thisArg[i]),i,thisArg]);
    }
    
    // JScript only uses the console Object in Debug mode
    if(!window.console.log) { window.console = new Object(); window.console.log = function (message) { }; }

    this.arrayConstructorWithBetterSerialiser["prototype"] = new Array();

    this.arrayConstructorWithBetterSerialiser.prototype.toString = function () { return "[" + Array.prototype.toString.apply(this) + "]"; };
    
  }
