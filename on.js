var Getter = require('y-setter').Getter,
    Yielded = require('y-resolver').Yielded,
    hook = require('./hook.js'),
    listeners = require('./listeners.js'),
    collection = require('./collection.js');

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

    elem[collection].add(
      this.event.watch(watcher,cb,elem)
    );

    return elem;
  }

  if(Yielded.is(this.event)){

    elem[collection].add(
      this.event.listen(ydListener,[cb,elem])
    );

    return elem;
  }

  listener = function(){
    cb[hook](elem,arguments);
  };

  elem.addEventListener(this.event, listener, this.useCapture);
  elem[listeners].push([this.event, listener, this.useCapture]);
  return elem;
}

// - utils

function watcher(v,ov,c,cb,elem){
  cb[hook](elem,[v,ov]);
}

function ydListener(cb,elem){
  cb[hook](elem,[this]);
}

/*/ exports /*/

module.exports = on;
