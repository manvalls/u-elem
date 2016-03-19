var define = require('u-proto/define'),
    hook = require('../../hook.js'),

    onlyOne = [
      'body',
      'html',
      'head'
    ];

String.prototype[define](hook,function(parent){
  var str = this.valueOf();

  if(!parent){
    if(validName(str)) return document.createElement(str);
    return document.querySelector(str);
  }

  parent.appendChild(document.createTextNode(str));
});

function validName(name){
  return /^\w[\w\-]*$/.test(name) && onlyOne.indexOf(name) == -1;
}
