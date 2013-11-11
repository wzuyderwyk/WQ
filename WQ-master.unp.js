/** GeneriQ WQ. Part of GeneriQ Q.
@author: Wietse Zuyderwyk */

// GeneriQ WQ. Part of GeneriQ Q.
// @author: Wietse Zuyderwyk

#define DEFACTO_GLOBAL this

#define CONSTRUCT_MASTER_WQ_OBJECT true
#define EXECUTE_TESTS true

#define MODULE_CONSTRUCTOR 0
#define MODULE_PROTOTYPE 1

#define WQPROPERTY 0
#define WQELEMENTS 1


(function (functionShouldbeExecuted) {
if (functionShouldbeExecuted !== true) return;
this["WQ"] = { /* Use of [...] to create property rather than variable for indirect references (e.g. through WQElements.global) */

  $x_model: null,
  
  $x_resolve: null,
  
  $x_reference: null, /* Looks up or sets up (weak) reference to properties. */
  
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
  /* Constructs new WQ with current WQ as prototype. Sets up ARP, index and toc. Loads modules and puts them in [0]... of (new) WQ. */
};

WQ.$x_modules.length = 7;

WQ.$x_modules[WQELEMENTS] = new Array( // WQElements module
  function () { /* WQElements constructor. */ // WQElements constructor.
#   include <WQElements.constructor.js>  
  
  },
  { /* WQElements prototype. */ // WQElements prototype.
#   include <WQElements.js>  
  
  }
);

this["WQElements"] = this.WQ.$x_modules[WQELEMENTS][MODULE_CONSTRUCTOR];

WQElements.prototype = this.WQ.$x_modules[WQELEMENTS][MODULE_PROTOTYPE];

}).apply(DEFACTO_GLOBAL,[CONSTRUCT_MASTER_WQ_OBJECT]);

// Test suite
(function (functionShouldbeExecuted) {
if (functionShouldbeExecuted !== true) return;
#include <WQTests.js>
}).apply(DEFACTO_GLOBAL,[EXECUTE_TESTS]);
