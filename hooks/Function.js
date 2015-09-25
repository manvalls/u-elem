var define = require('u-proto/define'),
    walk = require('y-walk'),
    hook = require('../hook.js');

Function.prototype[define](hook,function(parent,args){
  var ref = document.createTextNode('');

  parent = parent || document.createElement('div');
  parent.appendChild(ref);

  walk(this,args || [],parent).listen(listener,[parent,ref]);
  return parent;
});

function listener(parent,ref){
  var elem;

  if(this.value && this.value[hook]){
    elem = this.value[hook]();
    parent.insertBefore(elem,ref);
  }

}
