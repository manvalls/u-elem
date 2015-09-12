var hook = require('./hook.js'),
    event = Symbol(),
    listener = Symbol(),
    useCapture = Symbol();

function on(){
  return {
    [event]: arguments[0],
    [listener]: arguments[1],
    [useCapture]: arguments[2] ? true : false,

    [hook]: listen
  };
}

function listen(elem){
  elem = elem || ['div'][hook]();
  elem.addEventListener(this[event], this[listener], this[useCapture]);
  return elem;
}

/*/ exports /*/

module.exports = on;
