var define = require('u-proto/define'),
    walk = require('y-walk'),
    hook = require('../hook.js');

Function.prototype[define](hook,function(parent,args,that){
  return walk(this,args || [],that || parent)[hook](parent);
});
