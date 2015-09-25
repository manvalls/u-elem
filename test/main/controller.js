var Detacher = require('detacher');

function Controller(obj,col){
  this.text = obj.foo;
  col.add(new Detacher(() => obj.done = true));
};

module.exports = Controller;
