var Rul = require('rul'),
    Getter = require('y-setter').Getter,
    collection = require('./collection.js'),
    hook = require('./hook.js');

function forEach(rul,func,thisArg,timeout){

  if(typeof thisArg == 'number'){
    timeout = thisArg;
    thisArg = null;
  }

  return {
    rul: rul,
    func: func,
    timeout: timeout,
    thisArg: thisArg || this,
    [hook]: hookFn
  };
}

function hookFn(parent){
  var item,ref;

  parent = parent || document.createElement('div');

  if(Getter.is(this.rul)){
    ref = document.createTextNode('');
    parent.appendChild(ref);

    parent[collection].add(
      this.rul.watch(watcher,parent,ref,{},this.func,this.thisArg,this.timeout)
    );

    return parent;
  }

  if(!Rul.is(this.rul)){
    for(item of this.rul) this.func.call(this.thisArg,item)[hook](parent);
    return parent;
  }

  ref = document.createTextNode('');
  parent.appendChild(ref);
  parent[collection].add(bindRul(parent,ref,this.rul,this.func,this.thisArg,this.timeout));
  return parent;
}

function watcher(v,ov,c,parent,ref,ctx,func,thisArg,timeout){
  var rul;

  if(ctx.rulCtx) remove.call(ctx.rulCtx,0,ctx.rulCtx.array.length - 1);
  if(ctx.conn){
    parent[collection].remove(ctx.conn);
    ctx.conn.detach();
  }

  if(!Rul.is(v)){
    rul = new Rul();
    rul.append(v);
  }else rul = v;

  parent[collection].add(
    ctx.conn = bindRul(parent,ref,rul,func,thisArg,timeout,ctx.rulCtx = {})
  );
}

function bindRul(parent,ref,rul,func,thisArg,timeout,ctx){
  ctx = ctx || {};

  ctx.parent = parent;
  ctx.func = func;
  ctx.thisArg = thisArg;
  ctx.timeout = timeout;
  ctx.array = [ref];

  return rul.consume(add,remove,move,ctx);
}

function add(item,index){
  var elem = this.func.call(this.thisArg,item)[hook]();
  this.parent.insertBefore(elem,this.array[index]);
  this.array.splice(index,0,elem);
}

function remove(index,size){
  var i = index,
      sz = size;

  if(this.timeout == null) for(;size > 0;size--,index++) this.parent.removeChild(this.array[index]);
  else for(;size > 0;size--,index++)
    setTimeout(removeChild,this.timeout,this.parent,this.array[index]);

  this.array.splice(i,sz);
}

function move(from,to){
  var elem;

  elem = this.array.splice(from,1)[0];
  this.parent.removeChild(elem);

  this.parent.insertBefore(elem,this.array[to]);
  this.array.splice(to,0,elem);
}

function removeChild(parent,child){
  parent.removeChild(child);
}

/*/ exports /*/

module.exports = forEach;
