/**/ 'use strict' /**/
var Getter = require('y-setter').Getter,
    getGetter = require('./utils/getGetter.js'),
    hook = require('../hook.js'),
    destroy = require('../destroy.js'),
    detacher = require('../detacher.js'),
    chain = Symbol(),
    done = 'RB1wB9hCtPCR2IU';

class OnHook{

  constructor(getter,element){
    this[chain] = [{
      getter: getter,
      element: element
    }];
  }

  else(element){

    this[chain].push({
      getter: true,
      element: element
    });

    return this;
  }

  elseOn(getter,element){

    this[chain].push({
      getter: getter,
      element: element
    });

    return this;
  }

  [hook](parent){
    var g,getters,obj,ctxChain;

    parent = parent || document.createElement('div');

    getters = [];
    ctxChain = [];
    for(obj of this[chain]){

      getters.push(g = getGetter(obj.getter,parent));
      ctxChain.push({
        getter: g,
        element: obj.element
      });

    }

    g = Getter.transform(getters,transform,{chain: ctxChain});
    parent[detacher].add(
      g.watch(watchFn,parent)
    );

    return parent;
  }

}

function on(){
  return new OnHook(...arguments);
}

// utils

function transform(){
  var i,v;

  for(i = 0;i < arguments.length;i++) if(arguments[i] || this.chain[i].getter[done]){
    if('value' in this.chain[i] && this.chain[i].value == arguments[i]) return this.lastObj;
    v = this.chain[i].value;
    this.chain[i].value = arguments[i];

    return this.lastObj = {
      oldValue: v,
      value: this.chain[i].value,
      element: this.chain[i].element
    };
  }

  return this.lastObj = null;
}

function watchFn(obj,old,d,parent){
  if(!obj) return;
  obj.element[hook](parent,[obj.value,obj.oldValue],parent);
}

/*/ exports /*/

module.exports = on;
