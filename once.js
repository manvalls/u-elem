var Getter = require('y-setter').Getter,
    Yielded = require('y-resolver').Yielded,
    hook = require('./hook.js'),
    listeners = require('./listeners.js'),
    collection = require('./collection.js');

function once(){
  return {
    event: arguments[0],
    listener: arguments[1],
    useCapture: arguments[2] ? true : false,

    [hook]: listen
  };
}

function listen(elem){
  var cb = this.listener,
      event = this.event,
      useCapture = this.useCapture,
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

  listener = function(){
    var i;

    cb[hook](elem,arguments);
    elem.removeEventListener(event,listener,useCapture);

    i = elem[listeners].indexOf(lData);
    if(i != -1) elem[listeners].splice(i,1);
  };

  elem.addEventListener(event, listener, useCapture);
  elem[listeners].push(lData = [event, listener, useCapture]);
  return elem;
}

// - utils

function watcher(v,ov,c,cb,elem){
  if(!!v){
    cb[hook](elem,[v,ov]);
    c.detach();
  }
}

function ydListener(cb,elem){
  if(this.accepted) cb[hook](elem,[this.value]);
}

/*/ exports /*/

module.exports = once;
