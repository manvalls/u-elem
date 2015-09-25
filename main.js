var hook = require('./hook.js');

require('./hooks/Object.js');
require('./hooks/Function.js');
require('./hooks/Array.js');
require('./hooks/String.js');
require('./hooks/Node.js');

function x(){
  return Array.prototype[hook].call(arguments);
}

/*/ exports /*/

module.exports = x;
