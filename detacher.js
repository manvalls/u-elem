var Detacher = require('detacher'),
    define = require('u-proto/define'),
    detacher = Symbol(),
    innerCol = Symbol();

Node.prototype[define]({

  get [detacher](){
    if(this[innerCol]) return this[innerCol];

    this[innerCol] = new Detacher();
    this.addEventListener('destruction',onDestruction,false);
    return this[innerCol];
  }

});

function onDestruction(){
  var col = this[innerCol];

  delete this[innerCol];
  this.removeEventListener('destruction',onDestruction,false);
  col.detach();
}

/*/ exports /*/

module.exports = detacher;
