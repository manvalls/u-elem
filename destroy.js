var define = require('u-proto/define'),
    detacher = require('./detacher.js'),
    destroy = module.exports = Symbol();

Node.prototype[define](destroy,function(){
  var i;

  this[detacher].detach();
  for(i = 0;i < this.childNodes.length;i++) this.childNodes[i][destroy]();
});
