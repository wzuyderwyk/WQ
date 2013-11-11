/** Webkist GeneriQual
* Simple (non-cc-ed) parser; evaluates expressions based on prefix notation and explicit and implicit expression delimiters.
Will be used for DOM Object construction and more.

@author: Wietse Zuyderwyk */

/* Changelog:
   20131022: intial prototype version
   
   
*/

/* Testlog:
   20131028: Safari on iOS 4 doesn't have the Event constructor
   
   
   
*/

var WQ = function () { this.init(); }

WQ.global = this;

WQ.prototype = {

  // Todo: dynamic infix and postfix functions/operators, native objects and methods (i.e. (more) generic data and function syntax), (more types and) type checking and qualification/creativity 
  // BNF to WQ-IR converter, WQ-IR VM bytecode compiler and interpreter
  // And... rewrite and optimisation!
  
  
  $x_states: new Array(
    function (expression, newStateNotEvaluation) { return ((newStateNotEvaluation)?1:(expression)); },
    function (acc,newValue) { return parseInt(acc) + parseInt(newValue); },
    function (acc,newValue) { return parseInt(acc) * parseInt(newValue); },
    function (expression) { if (expression !== null) alert(expression); return 0; },
    function (identifier, newStateNotEvaluation) { if(newStateNotEvaluation) return 0; if(!this.identifierAssociatedValue[identifier]) throw new this.ParseError(3,identifier);
      return this.identifierAssociatedValue[identifier]; },
    function (assignmentStatement, newStateNotEvaluation) { if(newStateNotEvaluation) return 0; var tuple = assignmentStatement.split(","); if (tuple.length !== 2) throw new this.ParseError(4,"2"); else if(this.isValidIdentifier(tuple[0])) this.identifierAssociatedValue[tuple[0]] = tuple[1]; return tuple[1]; }
  ),
  
  
  preprocess: {
    // Needs some cleaner implementation; probably two passes
    replaceWhitespaceExpressionDelimitersAndCommas: function (text) {
      var noPlaceForAComma = true;
      var isFirstWhitespaceCharacterDelimiterOrComma = true;
      var textWithoutWhitespace = new String();
      var isString = false;
      Array.prototype.forEach.apply(text,[function (character, index, object) {
        if (character === "\"") isString = ((isString)?false:true);
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
        { result += character; if(character === "\"") isString = ((isString)?false:true); }
        else if(obj[index + 1] && !isString) result += character + ",";
    },this]);
    
    result = result.split(",");
    
    this.currentTypes = new Array();
    
    Array.prototype.forEach.apply(result,[function (tokenString,index,obj) { obj[index] = this.determineType(tokenString); },this]);
    
    return result.join(",");
  },

  determineType: function (tokenString) { // Types: 0=false, 1=true, 2=integer, 3=string, 4=floating-point number
    
    if (tokenString[0] === "\"" && tokenString[tokenString.length - 1] === "\"") { this.currentTypes.push(3); return tokenString.substr(1, tokenString.length - 2); }
    if (tokenString === "false") { this.currentTypes.push(0); return 0; }
    if (tokenString === "true") { this.currentTypes.push(1); return 1; }
    if(tokenString[0] && this.isValidIdentifier(tokenString)) {
      if (this.identifierAssociatedValue[tokenString]) return this.determineType(this.identifierAssociatedValue[tokenString]);
        else throw new WQ.prototype.ParseError(3,tokenString); }
        else { this.currentTypes.push(((tokenString.toString()[0])?1:0)); return tokenString; }
  },
  
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
    
    this.identifiers.forEach(function (identifier,index) { if(identifier === candidateIdentifier) state = this.identifierAssociatedStates[index](identifier,currentState,this); }, this);
    if(state === undefined) throw new this.ParseError(3,candidateIdentifier);

    return [state,currentSerialisationSubstring.length,candidateIdentifier];
  },

  identifiers: ["","*","+","=","mul","add","say","var","and","or","method"], // Needs to be ordered from longest to shortest for value-overlapping character strings

  implicitlyAndExplicitlyDelimitingCharactersPerState: ["0123456789,()"],

  identifierAssociatedStates: [
    function (identifier,currentState) { return 0; },
    function (identifier,currentState) { return 2; },
    function (identifier,currentState) { return 1; },
    function (identifier,currentState) { return 5; },
    function (identifier,currentState) { return 2; },
    function (identifier,currentState) { return 1; },
    function (identifier,currentState) { return 3; },
    function (identifier,currentState) { return 4; }
  ],
  
  identifierAssociatedArityAndPositioning: [
    { identifier: "a", left: 0, right: 1 }
  ],
  
  identifierAssociatedValue: {
    x: 2,
    y: 80
  },
  
  isValidIdentifier: function (candidateIdentifier) {
   return (candidateIdentifier[0].charCodeAt(0) > 64);
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
    "Parse error: function takes exactly {} arguments."
  ),

  ParseError: function(type,addedRemark) { this.message = ((type)?(new WQ).ParseErrorMessages[type]:(new WQ).ParseErrorMessages[0]).replace("{}",((addedRemark)?addedRemark:"")); this.toString = function() { return "ParseError"; }; },

  test: function () {
    try { this.evaluate("\
    say(=(z,10),\
      *(\
        *(\
          8,x\
        ),var(x),6,x,y\
      )\
    ),say(*(z,8)),say(8),say(\"natural language = undefined\")"); } catch(ex) { console.log(ex.message); }
    var x = new (new WQ).arrayConstructorWithBetterSerialiser();
  },
  
  hasBeenPreprocessed: false,

  evaluate: function (serialisation,state,delimiters) {
    
    // Todo: optimise by recomputing character offsets of delimiters after evaluation and re-using recomputed parse tree.
    
    var WQinstance = this;
    
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
    } else if (currentState === 4 || currentState === 5) { return state.apply(WQinstance,[serialisation,state(null,true)]); } // Variable assignment and reference
        else if (currentState !== 0) { serialisation = this.separateExpressionTokens(serialisation); return state.apply(WQinstance,[serialisation,state(null,true)]); };
    
    
    Array.prototype.forEach.apply(serialisation,[function (character,i,obj) {
      
      if(character === /* strict eq. op. may be faster */ delimiters[1]) {
        if(obj.expressions.length === 1) throw new (new WQ).ParseError(2);
        
        obj.expressions[obj.expressions.length - 1][0] = i;
        obj.expressions[obj.expressions.length - 1][1] = WQ.prototype.ExpressionEnd;
        obj.expressions[obj.expressions.length - 1][2] = obj.expressionDelimiterCounts[0] - obj.expressionDelimiterCounts[1];
        obj.expressions.push(new Array(null,null,null,null));
        obj.expressionDelimiterCounts[1] += 1;
        obj.expressionNestingLevels = ((obj.expressionDelimiterCounts[0] - obj.expressionDelimiterCounts[1] + 1 > obj.expressionNestingLevels)?(obj.expressionDelimiterCounts[0] - obj.expressionDelimiterCounts[1] + 1):(obj.expressionNestingLevels));
        
      } else
        if(character === /* strict eq. op. may be faster */ delimiters[0]) {
          
          obj.expressionDelimiterCounts[0] += 1;
          obj.expressions[obj.expressions.length - 1][0] = i;
          obj.expressions[obj.expressions.length - 1][1] = WQ.prototype.ExpressionStart;
          obj.expressions[obj.expressions.length - 1][2] = obj.expressionDelimiterCounts[0] - obj.expressionDelimiterCounts[1];
          obj.expressions[obj.expressions.length - 1][3] = obj.WQinstance.determineStateAndIdentifierLength(currentState,obj.substr(0,i));
          obj.expressions.push(new Array(null,null,null,null));
          
        }
      
    }]);
    if (serialisation.expressionDelimiterCounts[0] !== serialisation.expressionDelimiterCounts[1]) throw new this.ParseError(1);
    serialisation.endOfState = ((serialisation.expressionDelimiterCounts[0] === 0)?true:false);
    
    
    
    // Evaluate further on the highest nesting level; the most nested/deep subexpressions, and substitute each such expression with its evaluation (result)
    var mostNestedSubExpressions = new Array(new Array(0,0,"",0));
    serialisation.expressions.forEach (function (token) {
      if(token[2] === serialisation.expressionNestingLevels && token[1] === (new WQ).ExpressionStart) {
        mostNestedSubExpressions[mostNestedSubExpressions.length - 1][0] = token[0];
        mostNestedSubExpressions[mostNestedSubExpressions.length - 1][3] = token[3];
      }
      else if(token[2] === serialisation.expressionNestingLevels && token[1] === (new WQ).ExpressionEnd) {
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
      serialisation = serialisation.replace(expression[3][2] + expression[2],state(WQinstance.evaluate(expression[2].substr(1,expression[2].length - 2),expression[3][0])));
      
    });

    return this.evaluate(serialisation,(serialisation.endOfState)?state(null,true):currentState);
    
  },

  init: function () {
    /* For 3rd edition browsers, add forEach to the Array prototype (non-internal; becomes internal after Array construction) Object. */
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

};