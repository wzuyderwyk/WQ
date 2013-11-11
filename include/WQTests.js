/* @author: Wietse Zuyderwyk */

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
  
  addToAutoReleasePool: function (propertyName,propertyValue,shouldAppendValue /* or add; += */,extraAncestors/* creates new descendant properties or updates existing descendants of the ARP and returns a ARP for the leaf/terminal property */) {
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
    
    if ( /* duck type-checking for non-empty array or array-like object (however, not string or string-like). */
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
  }, /* Array.prototype.toString // sadly enough not generic and thus not usable here, yet flexible; checks for internal property class being Array; non-specific shared code */
  
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

alert(x[1]);

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

/* $x_model and $x_resolve:

Behaviour:
1) An object is created with function $x_model with a WQProperty prototype which itself has a DOM node host object as its prototype

2) $x_model, when called, creates a representation of its prototype's prototype as a new object which takes the object on which $x_model is called as prototype and replaces/sets its reference to itself (note: this means representations will be stacked).
   These objects will have a $x_referent property which references the DOM node object and a $x_resolve function object which replaces the DOM node with a new node constructed according to the model; its own properties.

Requirements:
1) a modelling function

2) a resolution function (WQProperty apply and toString)
*/

