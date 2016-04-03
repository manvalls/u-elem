var define = require('u-proto/define'),
    hook = require('../../hook.js'),
    x = require('../../main.js');

Array.prototype[define](hook,function h(parent){
  var i,ret;

  for(i = 0;i < this.length;i++){
    if(ret) break;
    if(this[i] != null && this[i][hook]) ret = this[i][hook]();
  }

  if(!ret) ret = document.createElement('div');
  if(parent) parent.appendChild(ret);
  x.lock.take().listen(hookRest,[this,i,ret]);

  return ret;
});

function hookRest(arr,i,parent){
  var e;

  for(;i < arr.length;i++){
    if(arr[i] == null) e = '';
    else e = arr[i];

    if(e[hook]) e[hook](parent);
  }

  x.lock.give();
}
