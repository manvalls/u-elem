var Getter = require('y-setter').Getter,
    Yielded = require('y-resolver').Yielded,
    hook = require('./hook.js'),
    listeners = require('./listeners.js'),
    detacher = require('./detacher.js');

function on(){
  return {
    event: arguments[0],
    listener: arguments[1],
    useCapture: arguments[2] ? true : false,

    [hook]: listen
  };
}

function listen(elem){
  var cb = this.listener,
      listener;

  elem = elem || document.createElement('div');

  if(Getter.is(this.event)){

    elem[detacher].add(
      this.event.watch(watcher,cb,elem)
    );

    return elem;
  }

  if(Yielded.is(this.event)){

    elem[detacher].add(
      this.event.listen(ydListener,[cb,elem])
    );

    return elem;
  }

  listener = function(){
    cb[hook](elem,arguments,elem);
  };

  elem.addEventListener(this.event, listener, this.useCapture);
  elem[listeners].push([this.event, listener, this.useCapture]);
  return elem;
}

// - utils

function watcher(v,ov,c,cb,elem){
  if(!!v) cb[hook](elem,[v,ov],elem);
}

function ydListener(cb,elem){
  if(this.accepted) cb[hook](elem,[this.value],elem);
}

/*/ exports /*/

module.exports = on;
