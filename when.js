var Collection = require('detacher/collection'),
    hook = require('./hook.js'),
    destroy = require('./destroy.js'),

    getter = Symbol(),
    elem = Symbol(),
    col = Symbol();

function when(){
  return {
    [getter]: arguments[0],
    [elem]: arguments[1],

    [hook]: hookFn
  };
}

function hookFn(parent){
  var ref = document.createTextNode('');

  parent = parent || ['div'][hook]();
  parent.appendChild(ref);

  if(!parent[col]){
    parent[col] = new Collection();
    parent.addEventListener('destruction',onDestruction,false);
  }

  parent[col].add(
    this[getter].watch(watchFn,this[elem],parent,ref,{})
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

function onDestruction(){
  this[col].detach();
}

/*/ exports /*/

module.exports = when;
