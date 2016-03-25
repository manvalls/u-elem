var Detacher = require('detacher'),
    define = require('u-proto/define'),
    detacher = 'q8fbo31unDH6bL9',
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
