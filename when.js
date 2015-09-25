var hook = require('./hook.js'),
    destroy = require('./destroy.js'),
    collection = require('./collection.js');

function when(){
  return {
    getter: arguments[0],
    elem: arguments[1],

    [hook]: hookFn
  };
}

function hookFn(parent){
  var ref = document.createTextNode('');

  parent = parent || document.createElement('div');
  parent.appendChild(ref);
  parent[collection].add(
    this.getter.watch(watchFn,this.elem,parent,ref,{})
  );

  return parent;
}

function watchFn(v,ov,d,elem,parent,ref,ctx){
  var e = ctx.elem;

  if(!v && e){
    delete ctx.elem;
    parent.removeChild(e);
    e[destroy]();
  }

  if(v && !e){
    ctx.elem = elem[hook]();
    parent.insertBefore(ctx.elem,ref);
  }

}

/*/ exports /*/

module.exports = when;
