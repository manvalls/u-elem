var Setter = require('y-setter'),
    Getter = Setter.Getter,
    Resolver = require('y-resolver'),
    Yielded = Resolver.Yielded,
    detacher = require('../../detacher.js'),
    destroy = require('../../destroy.js');

function getYielded(obj,parent){
  if(obj == destroy) obj = parent[detacher];
  if(!obj) return Resolver.reject(obj,true);
  if(typeof obj == 'string') return fromString(obj,parent);
  if(Yielded.is(obj) || obj[Yielded.getter]) return Yielded.get(obj);
  return Resolver.accept(obj);
}

// utils

function fromString(event,elem){
  var resolver = new Resolver(),
      det = elem[detacher],
      m,d;

  function listener(ev){
  	resolver.accept(ev);
  	elem.removeEventListener(event,listener,false)
    d.detach();
  }

  m = event.match(/^window\.(.*)/);
  if(m){
    elem = global.window;
    event = m[1];
  }

  elem.addEventListener(event,listener,false);
  d = det.listen(elem.removeEventListener,[event,listener,false],elem);
  det.add(resolver);

  return resolver.yielded;
}

/*/ exports /*/

module.exports = getYielded;
