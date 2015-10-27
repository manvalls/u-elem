var Getter = require('y-setter').Getter,
    Yielded = require('y-resolver').Yielded,
    hook = require('./hook.js'),
    listeners = require('./listeners.js'),
    collection = require('./collection.js');

function onceNot(){
  return {
    event: arguments[0],
    listener: arguments[1],

    [hook]: listen
  };
}

function listen(elem){
  var cb = this.listener,
      event = this.event,
      listener,lData;

  elem = elem || document.createElement('div');

  if(Getter.is(event)){

    elem[collection].add(
      event.watch(watcher,cb,elem)
    );

    return elem;
  }

  if(Yielded.is(event)){

    elem[collection].add(
      event.listen(ydListener,[cb,elem])
    );

    return elem;
  }

  return elem;
}

// - utils

function watcher(v,ov,c,cb,elem){
  if(!v){
    cb[hook](elem,[v,ov],elem);
    c.detach();
  }
}

function ydListener(cb,elem){
  if(this.rejected) cb[hook](elem,[this.error],elem);
}

/*/ exports /*/

module.exports = onceNot;
