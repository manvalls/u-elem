var hook = require('./hook.js'),
    listeners = require('./listeners.js');

function on(){
  return {
    event: arguments[0],
    listener: arguments[1],
    useCapture: arguments[2] ? true : false,

    [hook]: listen
  };
}

function listen(elem){
  elem = elem || ['div'][hook]();
  elem.addEventListener(this.event, this.listener, this.useCapture);
  elem[listeners].push([this.event, this.listener, this.useCapture]);

  return elem;
}

/*/ exports /*/

module.exports = on;
