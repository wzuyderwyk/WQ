


// GeneriQ WQ. Part of GeneriQ Q.
// @author: Wietse Zuyderwyk
//(function (functionShouldbeExecuted) {
//if (functionShouldbeExecuted !== true) return;
this["WQ"] = {

  $x_model: null,

  $x_resolve: null,

  $x_reference: null,

  $x_referent: this,

  $x_name: null,

  $x_parent: null,

  $x_toc: null,

  $x_index: null,

  $x_constructor: null,

  $x_modules: new Object()

}

WQ.$x_parent = this;

WQ.$x_constructor = function () {

};

WQ.$x_modules.length = 7;

WQ.$x_modules[1] = new Array( // WQElements module
  function () { // WQElements constructor.


this.init();

  },
  { // WQElements prototype.



// WQElements. Part of GeneriQ WQ.
// @author: Wietse Zuyderwyk
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
          { if (isFirstWhitespaceCharacterDelimiterOrComma || character === "(" || character === ")") { textWithoutWhitespace += ((character === "(")?"(":((character === ")")?")":((noPlaceForAComma)?"":((!isString)?",":character)))); isFirstWhitespaceCharacterDelimiterOrComma = (character === "(" || character === ")"); noPlaceForAComma = (character === "("); } }
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

  arrayConstructorWithBetterSerialiser: function() { },

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
    try { this.evaluate("    attach(\"main\",element(\"div\",[\"id=test\",\"class=test\"],[text(\"\\\"natural language = (x) \\(x\\) and child nodes should become last arguments; after attributes and style properties\")]))"); } catch(ex) { console.log(ex.message); }

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
      if(character === delimiters[1]) {
        if(obj.expressions.length === 1) throw new (new WQElements).ParseError(2);

        obj.expressions[obj.expressions.length - 1][0] = i;
        obj.expressions[obj.expressions.length - 1][1] = WQElements.prototype.ExpressionEnd;
        obj.expressions[obj.expressions.length - 1][2] = obj.expressionDelimiterCounts[0] - obj.expressionDelimiterCounts[1];
        obj.expressions.push(new Array(null,null,null,null));
        obj.expressionDelimiterCounts[1] += 1;
        obj.expressionNestingLevels = ((obj.expressionDelimiterCounts[0] - obj.expressionDelimiterCounts[1] + 1 > obj.expressionNestingLevels)?(obj.expressionDelimiterCounts[0] - obj.expressionDelimiterCounts[1] + 1):(obj.expressionNestingLevels));

      } else
        if(character === delimiters[0]) {

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

  }
);

this["WQElements"] = this.WQ.$x_modules[1][0];

WQElements.prototype = this.WQ.$x_modules[1][1];

//}).apply(this,[true]);

// Test suite
//(function (functionShouldbeExecuted) {
//if (functionShouldbeExecuted !== true) return;



autoreleasepool = function (global,ancestors,name) {
  if(!autoreleasepool.prototype.isPrototypeOf(this)) {
    if (ancestors && global["arp"]) {
      return (new autoreleasepool(global,ancestors,global["arp"].length));
    } else {
      if (global["arp"]) return global["arp"]; else return (new autoreleasepool(global,ancestors,name));
    }
  }
  // if called as constructor:
  if (name !== undefined) this.$x_name = name;
  this.ancestors = ancestors;
  this.global = global;
  if (global["arp"]) this.$x_parent = global["arp"]; else this.$x_parent = global;

  if (global && global.setProperty)this.setProperty = global.setProperty;
  if (global && global.resolveAncestorReferences)this.resolveAncestorReferences = global.resolveAncestorReferences;

  this.$x_parent[this.$x_name] = this;
  if (global["arp"])this.$x_parent.length += 1;

  this.forEach = Array.prototype.forEach; // borrow the intentionally-generic function forEach from the Array prototype
};

autoreleasepool.prototype = {
  properties: [],

  addToAutoReleasePool: function (propertyName,propertyValue,shouldAppendValue ,extraAncestors ) {
    this.properties.push(propertyName);

    if ( propertyValue !== undefined ) this.setProperty(propertyName,propertyValue,shouldAppendValue);
  },

  setProperty: function (referent,value,shouldAppend,ancestors) {
    if (this.ancestors) ancestors = this.ancestors; // to allow function in other code; modularisation

    if (referent.toString() === referent) var referentBase = this.resolveAncestorReferences(); else var referentBase = "";// here comes a resolution with this.ancestors

    if (!shouldAppend) { if (!referentBase[referent].set) referentBase[referent] = value; } else { if ( !referentBase[referent].get || !referentBase[referent].set ) referentBase[referent] += value; }
  },

  drain: function () {
    this.properties.forEach(function (propertyName) { delete this.resolveAncestorReferences()[propertyName]; }, this
  ); },

  drainAll: function () {
    this.forEach(function (arp) {
      arp.properties.forEach(function (propertyName) { delete this.resolveAncestorReferences()[propertyName]; }, arp);
    });
    this.drain();
  },

  resolveAncestorReferences: function (indexOrAncestors,referent,global) {
    if(this.global) global = this.global;
    if (!referent) referent = this.global;
    if ( indexOrAncestors === this.ancestors.length ) return referent;

    if (!indexOrAncestors) indexOrAncestors = 0;

    return this.resolveAncestorReferences(indexOrAncestors + 1, referent[this.ancestors[indexOrAncestors]]);
  },

  $x_merge: function (otherObject) {
    delete this.$x_parent[this.$x_name];
    var resultingObject = new Object();
  },

  $x_release: function () {
    delete this.$x_parent[this.$x_name];
  },

  $x_name: "arp",

  length: 0
};

autoreleasepool.prototype.add = autoreleasepool.prototype.addToAutoReleasePool;

var ARPTestObject = { test: { test: 5 } };

autoreleasepool(this,["ARPTestObject","test"]);

autoreleasepool(this).add("ARPTestObject");

autoreleasepool(this,["ARPTestObject"]);

autoreleasepool(this,["ARPTestObject","test"]);

autoreleasepool(this)[1].add("test");

autoreleasepool(this).drainAll();

autoreleasepool(this).$x_merge();


this["testResult"] = function (testDescription,hasBeenPassed,errorMessage) { document.write("<div style=\"color: " + ((hasBeenPassed)?"#0c0":"red") + "\">" + testDescription + ((hasBeenPassed)?" passed":" failed: "+errorMessage) + "!</div>"); };

this["removeNode"] = function (nodeID) { document.getElementById(nodeID).parentNode.removeChild(document.getElementById(nodeID)); }

this["tests"] = ["Parentheses test"];



try{
  this["currentTest"] = tests[0];
  document.getElementById("parenthesesTest").wq = (new WQElements).wqDOMNodeExtension;
  console.log(document.getElementById("parenthesesTest").wq("",true));
  testResult(currentTest,true);
  removeNode("parenthesesTest");
}catch (ex) { testResult(currentTest,false,ex.message); }


this["WQProperty"] = function () { this.constructor = WQProperty; };

WQProperty.prototype = {

  countPrototypes: function () { var i = 0; var currentPrototype = this.constructor.prototype; while (currentPrototype !== currentPrototype.constructor.prototype) { currentPrototype = currentPrototype.constructor.prototype; i += 1; } return i; },

  unprototypify: function (onlyCreateReferencesForPrototypes) {
    var i = 1;
    if (!onlyCreateReferencesForPrototypes) {
      var ownPropertyReceiver = new Object();
      for (property in this) { if (this[property] !== this.constructor.prototype[property]) ownPropertyReceiver[property] = this[property]; }
      this[0] = ownPropertyReceiver;

      var currentPrototype = this.constructor.prototype;
      while (currentPrototype !== currentPrototype.constructor.prototype) {
        ownPropertyReceiver = new Object();
        for (property in currentPrototype) { if (currentPrototype[property] !== currentPrototype.constructor.prototype[property]) ownPropertyReceiver[property] = currentPrototype[property]; }
        this[i] = ownPropertyReceiver;
        currentPrototype = currentPrototype.constructor.prototype;
        i += 1;
      }
    } else {
      this[0] = this;
      var currentPrototype = this.constructor.prototype;
      while (currentPrototype !== currentPrototype.constructor.prototype) {
        this[i] = currentPrototype;
        currentPrototype = currentPrototype.constructor.prototype;
        i += 1;
      }
    }
    this.length = i;

    return this;
  },

  prototypify: function (preserveFlatChain,useProtypingDirectlyOnItemsInFlatChain) {
  // useProtypingDirectlyOnItemsInFlatChain not yet implemented
    if(!preserveFlatChain) {

      this.forEach(function (object,index,wqproperty) {
        if (index !== 0) {
          var c;
          c = function () { if (wqproperty[index - 1]) this.constructor = wqproperty[index - 1].constructor; }
          c.prototype = object;
          wqproperty[index + 1] = new c();
          delete wqproperty[index];
        }
      });
      for (i in this[0]) { if (this[0][i] !== this[this.length][i] && i != this.length && i != 0) this[this.length][i] = this[0][i]; }
      if (this.$x_name && this.$x_parent) { this.$x_parent[this.$x_name] = this[this.length]; return this.$x_parent[this.$x_name]; }
      return this[this.length];

    } else {

      var prototypeChain = new Array();

      this.forEach(function (object) {

        prototypeChain.push(object);

      });

      prototypeChain.forEach(function (object,index,wqproperty) {
        index = prototypeChain.length - index;

        if (index !== 0) {
          var c;
          c = function () { if (prototypeChain[index + 1]) this.constructor = prototypeChain[index + 1].constructor; }
          c.prototype = prototypeChain[index];
          prototypeChain[index - 1] = new c();
        }
      });
      for (i in this[0]) { if (this[0][i] !== prototypeChain[i] && i != this.length && i != 0) prototypeChain[i] = this[0][i]; }

      var c;
      var wqproperty = this;
      c = function () { wqproperty.forEach(function (object,index,property) { this[index] = object; },this); this.length = wqproperty.length; };
      c.prototype = prototypeChain;

      var newObject = new c();
      if (this.$x_name && this.$x_parent) { this.$x_parent[this.$_name] = newObject; return this; }

      return newObject;

    }
  },

  addToPrototypeChain: function (object,retainObjectPrototypes,onlyReturn) {

    if (!retainObjectPrototypes) {

      var c = function (object) { for(i in object) { if (object[i] !== object.constructor.prototype[i]) { this[i] = object[i]; this[i+"$x_parent"] = this; } } this.constructor = c; };
      c.prototype = this;

      var newObject = new c(object);
      if (this.$x_name && this.$x_parent && !onlyReturn) { this.$x_parent[this.$x_name] = newObject; return newObject; }

      return newObject;

    } else {

      var thereArePrototypes = false;
      var currentPrototype = object.constructor.prototype;
      while (currentPrototype !== undefined && currentPrototype !== currentPrototype.constructor.prototype) {
        var objectPrototypeChain = new Array();

        objectPrototypeChain.push(currentPrototype);

        currentPrototype = currentPrototype.constructor.prototype;

        thereArePrototypes = true;
      }
      if (!thereArePrototypes) {
        if (onlyReturn) return this.addToPrototypeChain(object,false,true);
        return this.addToPrototypeChain(object); return this;
      }

      for (var i = objectPrototypeChain.length - 1; i >= 0; i--) {

        this.addToPrototypeChain(objectPrototypeChain[i],false,true);

      }

      if (onlyReturn) return this.addToPrototypeChain(object,false,true);

      this.addToPrototypeChain(object);

      return this;
    }
  },

  mergeDown: function (returnPreservingPrototypes) {
    var objectWithoutOldPrototypes = new Object();
    for (i in this) { objectWithoutOldPrototypes[i] = this[i] = this[i]; }
    return ((returnPreservingPrototypes)?this:objectWithoutOldPrototypes);
  },

  each: function (propertyName,propertyArray,currentPropertyParent) { // searches for and collects all properties with a certain name within its prototype chain
    if (propertyArray === undefined) propertyArray = new Array();
    if (currentPropertyParent === undefined) currentPropertyParent = this;

    if (currentPropertyParent[propertyName] !== undefined) propertyArray.push(currentPropertyParent[propertyName]); else
      return propertyArray;

    if (currentPropertyParent[propertyName+"$x_parent"] === currentPropertyParent[propertyName+"$x_parent"].constructor.prototype)
      return propertyArray;

    if (currentPropertyParent[propertyName+"$x_parent"].constructor)
      this.each(propertyName,propertyArray,currentPropertyParent[propertyName+"$x_parent"].constructor.prototype); else
      return propertyArray;

    var returnValue = (new WQProperty()).add(propertyArray);
    returnValue.length = propertyArray.length;
    return returnValue;
  },

  length: 0,

  apply: function (stringOrFunction,argumentArray,propagateReturnValue,defaultReturnValue) {

    if (propagateReturnValue === undefined) propagateReturnValue = true;
    if (!argumentArray) argumentArray = new Array();

    if (
      typeof(this) === "object" && this[0] && this.length !== undefined && this.forEach !== undefined && (this.forEach !== this.constructor.prototype.forEach || this.forEach === Array.prototype.forEach)
    ) {
      var returnValues = new Array();

      returnValues.length = this.length;

      this.forEach(function (object,index) {
        var returnValue;

        if (typeof(stringOrFunction) !== "function") stringOrFunction = object[stringOrFunction];

        if (index === 0) {
          returnValues[0] = (((returnValue = stringOrFunction.apply(object,argumentArray)) !== undefined) ? returnValue : defaultReturnValue);
          if (propagateReturnValue) { argumentArray[argumentArray.length] = returnValues[0]; argumentArray.length += 1; }
        } else {
          returnValues[index] = (((returnValue = stringOrFunction.apply(object,argumentArray)) !== undefined) ? returnValue : defaultReturnValue);
          if (propagateReturnValue) argumentArray[argumentArray.length - 1] = returnValues[index];
        }
      });

      return this.add(returnValues,false,true); // If the array is empty, it can only mean there are no members (0,1,...) of this (the this-value for apply)
      // Not that the functions didn't return.

    } else {
      var returnValue;

      if (typeof(stringOrFunction) !== "function") stringOrFunction = this[stringOrFunction];

      return this.add((returnValue = stringOrFunction.apply(this,argumentArray)) ? returnValue : defaultReturnValue,false,true);

    }

  },

  forEach: Array.prototype.forEach,

  toString: function () {
    var resultingString = "";
    var isNotFirst = false;

    this.forEach(function (object) { resultingString += isNotFirst = ((isNotFirst)?",":"") + object.toString(); });

    return resultingString;
  },

  WQinstances: new Array(null,null,null,null,null,null,null), // WQProperty, WQElements, WQStyle, WQEvents, WQParsers, WQRuntimes, WQMessages
  // WQMessages: handles Gap-O(csv), GO(csv), GapX
  // WQStyle: handles CSS, CT/Type, CSS4GX

  // Instances (and only one) should be "kept" in WQ and referenced only via the constructors called as functions which will return a "reference"; a string reference to the only real/strong reference. References are of the form: <base(native reference),path(array with strings)>
  // Function as weak references. Base is (ordinarily) the WQ (master) object. Nothing escapes this object and native references are deleted as
  // soon as desirable via ARPs (also in WQ, but more than one).
  // Parts of modules might be replicated (mostly via returns), but should be referenced only from inside the WQ master object
  WQconstructors: new Array(null,null,null,null,null,null,null),

  WQprototypes: new Array(null,null,null,null,null,null,null)

}

WQProperty.prototype.addObject = WQProperty.prototype.addToPrototypeChain;

WQProperty.prototype.add = WQProperty.prototype.addObject;

this["wqp"] = new WQProperty();

var w = { a: 5, b: 1 };

var x = { b: 2 };

var y = { b: 3 };

var z = { a: 0, b: 4 };


x = new WQProperty();

x["$x_parent"] = this;

x["$x_name"] = "x";


x.add(z).add(y).add(x).add(w);

x.unprototypify(true);

x["$x_parent"] = this;

x["$x_name"] = "x";

x.prototypify(true);

//x.mergeDown();

alert(x);



alert(x[0].b + " " + x[1].b + " " + x[2].b + " " + x[3].b);

//alert(x.b$x_parent.constructor.prototype.b$x_parent.constructor.prototype);

alert(x.each("b").apply("toString",[],false));

alert(x.each("b")[0] === x.b);

alert((35).toString(36)); // Should implement .toNumber(radix[,alphabet]|alphabet), where alphabet is an Array of chars; strings of length 1

(new WQElements).wqDOMNodeExtension.apply(document.getElementById("WQElementsTests"),[(new WQElements).wqDOMNodeExtension.apply(document.getElementById("WQElementsTests")),true,undefined,x]);

alert(x.each("_id"));

console.log((new WQElements).wqDOMNodeExtension.apply(document.getElementById("main")));

var X = new WQProperty();

X.$x_name = "X";

X.$x_parent = this;

X.add((new WQElements).modelObjectSerialiser());

X.add({ span: { div: { _id: "newestDiv" }, _style: "color: red", text: "some text", _id: "text" }, _class: "red", _id: "newdiv", $x_name: "div" });

alert(X.toString());

(new WQElements).wqDOMNodeExtension.apply(document.getElementById("WQElementsTests"),[X.toString(),true]);

alert(X.toString());

alert(Object.keys(X));

//alert(Object.keys(x));
//}).apply(this,[true]);
