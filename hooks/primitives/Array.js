var define = require('u-proto/define'),
    hook = require('../../hook.js');

Array.prototype[define](hook,function h(parent){
  var i,ret,e;

  for(i = 0;i < this.length;i++){
    if(ret) break;
    if(this[i] != null && this[i][hook]) ret = this[i][hook]();
  }

  if(!ret) ret = document.createElement('div');
  if(parent) parent.appendChild(ret);

  for(;i < this.length;i++){
    if(this[i] == null) e = '';
    else e = this[i];

    if(e[hook]) e[hook](ret);
  }

  return ret;
});
