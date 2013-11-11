/** Simple parser; adds up results of expressions and/or literal Numbers.
Will be used for DOM Object construction.

@author: Wietse Zuyderwyk */

var WQ = function () { this.init(); }

WQ.global = this;

WQ.prototype = {

  preprocess: {
    // Needs some cleaner implementation; probably two passes
    replaceWhitespaceExpressionDelimitersAndCommas: function (text) {
      var noPlaceForAComma = true;
      var isFirstWhitespaceCharacterDelimiterOrComma = true;
      var textWithoutWhitespace = new String();
      Array.prototype.forEach.apply(text,[function (character, index, object) {
        if (character === ")" && textWithoutWhitespace.substr(-1) === ",") textWithoutWhitespace = textWithoutWhitespace.substr(0,textWithoutWhitespace.length - 1);
        if (character === " " || character === "," || character === "(" || character === ")" || character === "\t" || character === "\r" || character === "\n")
          { if (isFirstWhitespaceCharacterDelimiterOrComma || character === "(" || character === ")") { textWithoutWhitespace += ((character === "(")?"(":((character === ")")?")":((noPlaceForAComma)?"":","))); isFirstWhitespaceCharacterDelimiterOrComma =  (character === "(" || character === ")"); noPlaceForAComma = (character === "("); } }
          else { textWithoutWhitespace += character; isFirstWhitespaceCharacterDelimiterOrComma = true; noPlaceForAComma = (object[index + 1] === ")"); }
      }]);
      return textWithoutWhitespace;
    }
  },
  
  separateExpressionTokens: function (expression) {
    result = new String();
    Array.prototype.forEach.apply(expression,[function (character, index, obj) {
      if(obj[index + 1] && this.areTokenStringSetMembersOfSameKind(character, obj[index + 1]))
        result += character;
        else if(obj[index + 1]) result += character + ",";
    },this]);
    
    // Array.prototype.forEach.apply(
    alert(result);
    return expression;
  },
  
  tokenStringMemberSetConditions: [
    [[65,90],[97,122]],
    [[48,57]]
  ],
  
  // Needs stricter adherence to conditions
  areTokenStringSetMembersOfSameKind: function(tokenCharacter1,tokenCharacter2) { return !(tokenCharacter1.charCodeAt(0) > this.tokenStringMemberSetConditions[0][0][0] && tokenCharacter2.charCodeAt(0) < this.tokenStringMemberSetConditions[1][0][1]); },

  arrayConstructorWithBetterSerialiser: function() { /*  ES3 doesn't allow setting the internal prototype after Object creation ( ; here in the constructor), so I use init. */ },

  $x_delimiters: new Array(new Array("(",")")),

  $x_states: new Array(
    function (expression,newStateNotEvaluation) { return ((newStateNotEvaluation)?1:(expression)); },
    function (acc,newValue) { return parseInt(acc) + parseInt(newValue); },
    function (acc,newValue) { return parseInt(acc) * parseInt(newValue); },
    function (expression) { alert(expression); return expression; },
    function (identifier) { return this.identifierAssociatedValue[identifier]; }
  ),

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
    
    this.identifiers.forEach(function (identifier,index) { if(identifier === candidateIdentifier) state = (new WQ).identifierAssociatedStates[index](identifier,currentState); });
    if(state === undefined) throw new this.ParseError(3,candidateIdentifier);

    return [state,currentSerialisationSubstring.length,candidateIdentifier];
  },

  identifiers: ["","*","+","mul","add","say","var"], // Needs to be ordered from longest to shortest for value-overlapping character strings

  implicitlyAndExplicitlyDelimitingCharactersPerState: ["0123456789,()"],

  identifierAssociatedStates: [
    function (identifier,currentState) { return 0; },
    function (identifier,currentState) { return 2; },
    function (identifier,currentState) { return 1; },
    function (identifier,currentState) { return 2; },
    function (identifier,currentState) { return 1; },
    function (identifier,currentState) { return 3; },
    function (identifier,currentState) { return 4; }
  ],
  
  identifierAssociatedArityAndPositioning: [
    { identifier: "a", left: 0, right: 1 }
  ],
  
  identifierAssociatedValue: {
    a: 10
  },
  
  isValidIdentifier: function (candidateIdentifier) {
   return (candidateIdentifier[0].charCodeAt(0) > 64);
  },

  $_qualify: function () { },

  ExpressionStart: 1,

  ExpressionEnd: 2,

  ParseErrorMessages: new Array(
    "Failed to parse.",
    "Syntax error: unbalanced expression delimiters.",
    "Syntax error: cannot end an expression with delimiter type not used in starting it.",
    "Parse error: unknown identifier: "
  ),

  ParseError: function(type,addedRemark) { this.message = ((type)?(new WQ).ParseErrorMessages[type]:(new WQ).ParseErrorMessages[0]) + ((addedRemark)?addedRemark:""); this.toString = function() { return "ParseError"; }; },

  test: function () {
    try { this.evaluate("\
    say(\
      mul(\
        *(add(\
          9,42,6,3,9,44\
        ),\
        +(5,10,4),\
        *(\
          7,\
          mul(1,1),\
          8\
        ),\
        42\
      ),\
    10000))"); } catch(ex) { console.log(ex.message); }
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
    serialisation.expressionDelimiterCounts = new Array(0,0); // Could be [0,0], but old Mozilla browsers only construct with the 'new' statement
    serialisation.expressionNestingLevels = 0;
    
    if(!delimiters) delimiters = this.$x_delimiters[0];
    
    var currentState;
    state = this.$x_states[(currentState = ((!state)?0:state))];
    
    if (currentState === 1 || currentState === 2) {
      var nums = new Array(); serialisation = this.separateExpressionTokens(serialisation); serialisation.split(",").forEach(function (tokenString) { nums.push(tokenString); }); return nums.reduce((new WQ).$x_states[currentState]);
    } else if (currentState !== 0) return (new WQ).$x_states[currentState](serialisation);
    
    
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
          obj.expressions[obj.expressions.length - 1][3] = (new WQ).determineStateAndIdentifierLength(currentState,obj.substr(0,i));
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