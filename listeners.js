var define = require('u-proto/define'),
    listeners = Symbol(),
    innerLis = Symbol();

Node.prototype[define]({

  get [listeners](){
    if(this[innerLis]) return this[innerLis];

    this[innerLis] = [];
    this.addEventListener('destruction',onDestruction,false);
    return this[innerLis];
  }

});

function onDestruction(){
  var lis = this[innerLis],
      i;

  delete this[innerLis];
  this.removeEventListener('destruction',onDestruction,false);
  for(i = 0;i < lis.length;i++) this.removeEventListener(lis[i][0],lis[i][1],lis[i][2] || false);
}

/*/ exports /*/

module.exports = listeners;
