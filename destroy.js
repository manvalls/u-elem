var define = require('u-proto/define'),
    destroy = module.exports = Symbol();

Node.prototype[define](destroy,function(){
  var i;
  
  this.dispatchEvent(new Event('destruction'));
  for(i = 0;i < this.childNodes.length;i++) this.childNodes[i][destroy]();
});
