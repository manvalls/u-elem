var Detacher = require('detacher'),
    define = require('u-proto/define'),
    detacher = Symbol(),
    innerCol = 'fEOxfrCMFoiZZJb';

Node.prototype[define]({

  get [detacher](){
    if(this[innerCol]) return this[innerCol];

    this[innerCol] = new Detacher();
    return this[innerCol];
  }

});

/*/ exports /*/

module.exports = detacher;
