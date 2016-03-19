var hook = require('./hook.js');

require('./hooks/primitives/Object.js');
require('./hooks/primitives/Function.js');
require('./hooks/primitives/Array.js');
require('./hooks/primitives/String.js');
require('./hooks/primitives/Node.js');

function x(){
  return Array.prototype[hook].call(arguments);
}

/*/ exports /*/

module.exports = x;
