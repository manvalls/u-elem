/**/ 'use strict' /**/
var Getter = require('y-setter').Getter,
    getGetter = require('./utils/getGetter.js'),
    hook = require('../hook.js'),
    destroy = require('../destroy.js'),
    detacher = require('../detacher.js'),
    chain = Symbol(),
    done = 'RB1wB9hCtPCR2IU';

class WhenHook{

  constructor(getter,element,opt){
    this[chain] = [{
      getter: getter,
      element: element,
      options: opt || {}
    }];
  }

  else(element,opt){

    this[chain].push({
      getter: true,
      element: element,
      options: opt || {}
    });

    return this;
  }

  elseWhen(getter,element,opt){

    this[chain].push({
      getter: getter,
      element: element,
      options: opt || {}
    });

    return this;
  }

  [hook](parent){
    var g,getters,ref,obj,ctxChain;

    ref = document.createTextNode('');
    parent = parent || document.createElement('div');

    getters = [];
    ctxChain = [];
    for(obj of this[chain]){

      getters.push(g = getGetter(obj.getter,parent));
      ctxChain.push({
        getter: g,
        element: obj.element,
        options: obj.options
      });

    }

    g = Getter.transform(getters,transform,{chain: ctxChain});

    parent.appendChild(ref);
    parent[detacher].add(
      g.watch(watchFn,parent,ref)
    );

    return parent;
  }

}

function when(){
  return new WhenHook(...arguments);
}

// utils

function transform(){
  var i,v;
  for(i = 0;i < arguments.length;i++) if(arguments[i] || this.chain[i].getter[done])
    return this.chain[i];
}

function watchFn(obj,oldObj,d,parent,ref){
  var domElement;

  if(oldObj && oldObj.domElement){
    domElement = oldObj.domElement;
    delete oldObj.domElement;
    domElement[destroy]();

    if(oldObj.options.removalTimeout != null){
      oldObj.domElement = domElement;
      oldObj.timer = setTimeout(remove,oldObj.options.removalTimeout,parent,oldObj,domElement);
    }else parent.removeChild(domElement);
  }

  if(obj && obj.element){

    if(obj.domElement){
      parent.removeChild(obj.domElement);
      clearTimeout(obj.timer);
    }

    obj.domElement = obj.element[hook](null,[obj.getter]);
    parent.insertBefore(obj.domElement,ref);
  }

}

function remove(parent,obj,elem){
  if(obj.domElement != elem) return;
  parent.removeChild(obj.domElement);
  delete obj.domElement;
  delete obj.timer;
}

/*/ exports /*/

module.exports = when;
