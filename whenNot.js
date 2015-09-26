var Getter = require('y-setter').Getter,
    hook = require('./hook.js'),
    destroy = require('./destroy.js'),
    collection = require('./collection.js');

function whenNot(){
  return {
    getter: arguments[0],
    elem: arguments[1],
    timeout: arguments[2],

    [hook]: hookFn
  };
}

function hookFn(parent){
  var ref;

  if(!Getter.is(this.getter)){
    if(!this.getter) this.elem[hook](parent);
    return;
  }

  ref = document.createTextNode('');
  parent = parent || document.createElement('div');
  parent.appendChild(ref);

  parent[collection].add(
    this.getter.watch(watchFn,this.elem,parent,ref,{},this.timeout)
  );

  return parent;
}

function watchFn(v,ov,d,elem,parent,ref,ctx,timeout){
  var e = ctx.elem;

  if(v && e){
    delete ctx.elem;
    if(timeout != null){
      ctx.e = e;
      ctx.timeout = setTimeout(remove,timeout,parent,ctx);
    }else parent.removeChild(e);
    e[destroy]();
  }

  if(!v && !e){

    if(timeout != null && ctx.e){
      clearTimeout(ctx.timeout);
      remove(parent,ctx);
    }

    ctx.elem = elem[hook]();
    parent.insertBefore(ctx.elem,ref);
  }

}

function remove(parent,ctx){
  parent.removeChild(ctx.e);
  delete ctx.timeout;
  delete ctx.e;
}

/*/ exports /*/

module.exports = whenNot;
