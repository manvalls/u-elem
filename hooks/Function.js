var define = require('u-proto/define'),
    walk = require('y-walk'),
    hook = require('../hook.js');

Function.prototype[define](hook,function(parent,args){
  var ref,yd;

  yd = walk(this,args || [],parent);
  if(yd.done){
    if(yd.value && yd.value[hook]) return yd.value[hook](parent);
    return parent || document.createElement('div');
  }

  ref = document.createTextNode('');
  parent = parent || document.createElement('div');
  parent.appendChild(ref);

  yd.listen(listener,[parent,ref]);
  return parent;
});

function listener(parent,ref){
  var elem;

  if(this.value && this.value[hook]){
    elem = this.value[hook]();
    parent.insertBefore(elem,ref);
  }

}
