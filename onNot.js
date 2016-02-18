var Getter = require('y-setter').Getter,
    Yielded = require('y-resolver').Yielded,
    hook = require('./hook.js'),
    listeners = require('./listeners.js'),
    detacher = require('./detacher.js');

function onNot(){
  return {
    event: arguments[0],
    listener: arguments[1],

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

  return elem;
}

// - utils

function watcher(v,ov,c,cb,elem){
  if(!v) cb[hook](elem,[v,ov],elem);
}

function ydListener(cb,elem){
  if(this.rejected) cb[hook](elem,[this.error],elem);
}

/*/ exports /*/

module.exports = onNot;
