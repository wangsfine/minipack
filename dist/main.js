(function () {
  const modules = {



    "D:\\vscode_workspace\\minipack\\src\\a.js": function (module, exports, require) {
      "use strict";

      var _b = require("D:\\vscode_workspace\\minipack\\src\\b.js");

      (0, _b.testb)();
      console.log('testa----------->');
    },

    "D:\\vscode_workspace\\minipack\\src\\b.js": function (module, exports, require) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.testb = testb;

        var _c = require("D:\\vscode_workspace\\minipack\\src\\c.js");

        function testb() {
          (0, _c.testc)();
          console.log('testb------->');
        }
      }

      ,

    "D:\\vscode_workspace\\minipack\\src\\c.js": function (module, exports, require) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.testc = testc;

      function testc() {
        console.log('testc------>');
      }
    }


  };
  const caches = {

  };

  function require(moduleId) {
    if (!caches.hasOwnProperty(moduleId)) {
      const moduleO = {
        exports: {},
      };
      modules[moduleId].call(null, moduleO, moduleO.exports, require)
      return caches[moduleId] = moduleO.exports;
    }
    return caches[moduleId];
  }

  require("D:\\vscode_workspace\\minipack\\src\\a.js");
})();