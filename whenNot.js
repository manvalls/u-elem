var Setter = require('y-setter'),
    Getter = Setter.Getter,
    when = require('./when.js');

function whenNot(getter,elem,timeout){
  if(!Getter.is(getter)) getter = (new Setter(getter)).getter;
  return when(getter.not,elem,timeout);
}

/*/ exports /*/

module.exports = whenNot;
