var define = require('u-proto/define'),
    hook = require('../hook.js');

Node.prototype[define](hook,function(parent){
  if(parent) parent.appendChild(this);
  return this;
});
