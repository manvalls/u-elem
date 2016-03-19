var Rul = require('rul'),
    Getter = require('y-setter').Getter,
    detacher = require('../detacher.js'),
    hook = require('../hook.js'),
    getRul = require('./utils/getRul.js'),
    rul = Symbol(),
    callback = Symbol(),
    thisArg = Symbol(),
    timeout = Symbol();

function forEach(r,func,that,t){

  if(typeof that == 'number'){
    t = that;
    that = null;
  }

  return {
    [rul]: r,
    [callback]: func,
    [timeout]: t,
    [thisArg]: that || this,
    [hook]: hookFn
  };
}

function hookFn(parent){
  var item,ref,r,ctx;

  parent = parent || document.createElement('div');
  r = getRul(this[rul],parent[detacher]);

  ref = document.createTextNode('');
  parent.appendChild(ref);
  ctx = ctx || {};

  ctx.parent = parent;
  ctx.callback = this[callback];
  ctx.thisArg = this[thisArg];
  ctx.timeout = this[timeout];
  ctx.array = [ref];

  parent[detacher].add(
    r.consume(add,remove,move,ctx)
  );

  return parent;
}

function add(item,index){
  var elem = this.callback.call(this.thisArg,item)[hook]();
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
