var Collection = require('detacher/collection'),
    define = require('u-proto/define'),
    collection = Symbol(),
    innerCol = Symbol();

Node.prototype[define]({

  get [collection](){
    if(this[innerCol]) return this[innerCol];

    this[innerCol] = new Collection();
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

module.exports = collection;
