var define = require('u-proto/define'),
    apply = require('u-proto/apply'),
    Collection = require('detacher/collection'),
    Getter = require('y-setter').Getter,

    hook = require('../hook.js'),
    collection = Symbol(),
    connection = Symbol();

Object.prototype[define](hook,function(parent){
  var txt,elem,ctrl;

  if(typeof this.controller == 'function' && typeof this.view == 'function'){
    ctrl = new this.controller(this);
    elem = this.view(ctrl,this)[hook]();

    if(!parent) return elem;
    parent.appendChild(elem);
    return;
  }

  if(!parent) parent = ['div'][hook]();

  if(Getter.is(this)){
    txt = document.createTextNode('');
    txt[connection] = this.connect(txt,'textContent');
    txt.addEventListener('destruction',onTNDestruction,false);

    parent.appendChild(txt);
    return parent;
  }

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

function onTNDestruction(){
  this[connection].detach();
}
