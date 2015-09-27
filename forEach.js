var Rul = require('rul'),
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
  var ctx = {},
      item;

  if(!Rul.is(this.rul)){
    for(item of this.rul) this.func.call(this.thisArg,item)[hook](parent);
    return;
  }

  parent = parent || document.createElement('div');

  ctx.parent = parent;
  ctx.func = this.func;
  ctx.thisArg = this.thisArg;
  ctx.timeout = this.timeout;
  ctx.array = [];

  parent[collection].add(
    this.rul.consume(add,remove,move,ctx)
  );

  return parent;
}

function add(item,index){
  var elem = this.func.call(this.thisArg,item)[hook]();

  if(index == this.array.length){
    this.array.push(elem);
    this.parent.appendChild(elem);
    return;
  }

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

  if(to == this.array.length) this.parent.appendChild(elem);
  else this.parent.insertBefore(elem,this.array[to]);
  this.array.splice(to,0,elem);
}

function removeChild(parent,child){
  parent.removeChild(child);
}

/*/ exports /*/

module.exports = forEach;
