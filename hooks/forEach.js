var Detacher = require('detacher'),
    Setter = require('y-setter'),
    getGetter = require('./utils/getGetter.js'),
    detacher = require('../detacher.js'),
    hook = require('../hook.js'),
    x = require('../main.js'),
    getter = Symbol(),
    func = Symbol(),
    options = Symbol(),
    eobj = Symbol(),
    eidx = Symbol();

function forEach(g,f,opt){
  return {
  	[getter]: g,
  	[func]: f,
    [options]: opt || {},
    [hook]: hookFn
  };
}

function hookFn(parent){
  var g,ref;

  parent = parent || document.createElement('div');
  ref = document.createTextNode('');
  parent.appendChild(ref);
  g = getGetter(this[getter]);

  parent[detacher].add(
    g.watch(watcher,parent,ref,this[func],this[options],new Map(),new Map(),{elems: new Set()})
  );

  return parent;
}

function watcher(v,ov,d,parent,ref,func,opt,map,dm,ctx){
	var elems = new Set(),
	    d = new Detacher(),
	    elem,obj,it,idx,
      old,i,increment,data;

  v = v || [];
  i = 0;

  x.lock.capture();

  for(obj of v){

  	if(map.has(obj)){

      elem = map.get(obj);
      elem[eidx].value = i;
      elems.add(elem);

  	}else{

      idx = new Setter(i);
  	  elem = func[hook](null,[obj,idx.getter],parent);
      elem[eidx] = idx;

  	  elems.add(elem);
  	  map.set(obj,elem);
  	  elem[eobj] = obj;

      if(dm.has(obj)){
        data = dm.get(obj);
        dm.delete(obj);
        parent.removeChild(data.element);
        clearTimeout(data.timeout);
      }

      if(opt.reorder === false) parent.insertBefore(elem,ref);

  	}

    i++;

  }

  for(elem of ctx.elems){

  	if(!elems.has(elem)){

  	  d.add(elem[detacher]);
      obj = elem[eobj];
      delete elem[eobj];
  	  map.delete(obj);

      if(opt.removalTimeout) dm.set(obj,{
        timeout: setTimeout(remove,opt.removalTimeout,parent,elem,obj,dm),
        element: elem
      });
  	  else parent.removeChild(elem);
  	  ctx.elems.delete(elem);

  	}

  }

  if(opt.reorder !== false){

    it = ctx.elems.values();
    increment = true;

    for(elem of elems){

      if(increment) old = it.next();

    	if(old.done){
    	  parent.insertBefore(elem,ref);
        increment = false;
    	}else if(old.value != elem){
    	  parent.insertBefore(elem,old.value);
        ctx.elems.delete(elem);
        increment = false;
    	}else increment = true;

    }

  }

  ctx.elems = elems;
  d.detach();

  x.lock.give();
  
}

function remove(parent,child,obj,dm){
  dm.delete(obj);
  parent.removeChild(child);
}

/*/ exports /*/

module.exports = forEach;
