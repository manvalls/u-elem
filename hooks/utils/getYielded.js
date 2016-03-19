var Setter = require('y-setter'),
    Getter = Setter.Getter,
    Resolver = require('y-resolver'),
    Yielded = Resolver.Yielded,
    detacher = require('../../detacher.js');

function getYielded(obj,parent){
  if(!obj) return Resolver.reject(obj,true);
  if(typeof obj == 'string') return fromString(obj,parent);
  if(Yielded.is(obj) || obj[Yielded.getter]) return Yielded.get(obj);
  return Resolver.accept(obj);
}

// utils

function fromString(event,elem){
  var resolver = new Resolver(),
      d;

  function listener(ev){
  	resolver.accept(ev);
  	elem.removeEventListener(event,listener,false)
    d.detach();
  }

  elem.addEventListener(event,listener,false);
  d = elem[detacher].listen(elem.removeEventListener,[event,listener,false],elem);
  elem[detacher].add(resolver);

  return resolver.yielded;
}

/*/ exports /*/

module.exports = getYielded;
