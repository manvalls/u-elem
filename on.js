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
  var listener = () => this.listener[hook](elem);

  elem = elem || document.createElement('div');
  elem.addEventListener(this.event, listener, this.useCapture);
  elem[listeners].push([this.event, listener, this.useCapture]);

  return elem;
}

/*/ exports /*/

module.exports = on;
