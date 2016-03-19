var Setter = require('y-setter'),
    Getter = Setter.Getter,
    Resolver = require('y-resolver'),
    Yielded = Resolver.Yielded,
    detacher = require('../../detacher.js'),
    done = 'RB1wB9hCtPCR2IU';

function getGetter(obj,parent){
  if(!obj) return fromRaw(obj);
  if(Getter.is(obj)) return obj;
  if(typeof obj == 'string') return fromString(obj,parent);
  if(Yielded.is(obj) || obj[Yielded.getter]) return fromYd(Yielded.get(obj));
  return fromRaw(obj);
}

// utils

function fromRaw(raw){
	 var setter = new Setter(raw);
	 setter.freeze();
	 return setter.getter;
}

function fromYd(yd){
  var setter = new Setter(null);
  yd.listen(ydListener,[setter]);
  return setter.getter;
}

function ydListener(setter){
	if(this.accepted) setter.getter[done] = true;
  setter.value = this.value;
  setter.freeze();
}

function fromString(event,elem){
  var setter = new Setter(null);

  function listener(ev){
  	setter.value = ev;
  }

  elem.addEventListener(event,listener,false);
  elem[detacher].listen(elem.removeEventListener,[event,listener,false],elem);
  elem[detacher].add(setter);

  return setter.getter;
}

/*/ exports /*/

module.exports = getGetter;
