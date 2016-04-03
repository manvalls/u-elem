var hook = require('./hook.js'),
    Lock = require('y-lock'),
    lock = global['G3MyQLX1Hn3EWNr'] = global['G3MyQLX1Hn3EWNr'] || new Lock();

function x(){
  return Array.prototype[hook].call(arguments);
}

Object.defineProperty(x,'lock',{get: function(){ return lock; }});

/*/ exports /*/

module.exports = x;

require('./hooks/primitives/Object.js');
require('./hooks/primitives/Function.js');
require('./hooks/primitives/Array.js');
require('./hooks/primitives/String.js');
require('./hooks/primitives/Node.js');
