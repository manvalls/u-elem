var getYielded = require('./utils/getYielded.js'),
    hook = require('../hook.js'),
    detacher = require('../detacher.js'),
    yielded = Symbol(),
    element = Symbol();

function once(y,e){
  return {
    [yielded]: y,
    [element]: e,
    [hook]: hookFn
  };
}

function hookFn(parent){
  var y;

  parent = parent || document.createElement('div');
  y = getYielded(this[yielded],parent);

  parent[detacher].add(
    y.listen(listener,[this[element],parent])
  );

  return parent;
}

// - utils

function listener(elem,parent){
  if(this.accepted) elem[hook](parent,[this.value],parent);
}

/*/ exports /*/

module.exports = once;
