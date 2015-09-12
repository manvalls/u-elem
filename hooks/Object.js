var define = require('u-proto/define'),
    apply = require('u-proto/apply'),
    Collection = require('detacher/collection'),

    hook = require('../hook.js'),
    collection = Symbol();

Object.prototype[define](hook,function h(parent){

  if(!parent) parent = ['div'][hook]();

  if(!parent[collection]){
    parent[collection] = new Collection();
    parent.addEventListener('destruction',onDestruction,false);
  }

  parent[apply](this,parent[collection]);
  return parent;

},{writable: true});

function onDestruction(){
  this[collection].detach();
}
