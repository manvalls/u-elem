var Setter = require('y-setter'),
    Getter = Setter.Getter,
    hook = require('./hook.js'),
    destroy = require('./destroy.js'),
    detacher = require('./detacher.js'),
    getter = Symbol(),
    element = Symbol(),
    timeout = Symbol();

function when(g,e,t){

  if(!Getter.is(g)) g = (new Setter(g)).getter;

  return {
    [getter]: g,
    [element]: e,
    [timeout]: t,

    [hook]: hookFn
  };
}

function hookFn(parent){
  var ref;

  ref = document.createTextNode('');
  parent = parent || document.createElement('div');
  parent.appendChild(ref);

  parent[detacher].add(
    this[getter].watch(watchFn,this[element],parent,ref,{},this[timeout])
  );

  return parent;
}

function watchFn(v,ov,d,elem,parent,ref,ctx,timeout){
  var e = ctx.elem;

  if(!v && e){
    delete ctx.elem;
    if(timeout != null){
      ctx.e = e;
      ctx.timeout = setTimeout(remove,timeout,parent,ctx);
    }else parent.removeChild(e);
    e[destroy]();
  }

  if(v && !e){

    if(timeout != null && ctx.e){
      clearTimeout(ctx.timeout);
      remove(parent,ctx);
    }

    ctx.elem = elem[hook](null,this);
    parent.insertBefore(ctx.elem,ref);
  }

}

function remove(parent,ctx){
  parent.removeChild(ctx.e);
  delete ctx.timeout;
  delete ctx.e;
}

/*/ exports /*/

module.exports = when;
