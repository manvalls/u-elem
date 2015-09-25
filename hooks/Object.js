var define = require('u-proto/define'),
    apply = require('u-proto/apply'),
    collection = require('../collection'),
    Collection = require('detacher/collection'),
    Getter = require('y-setter').Getter,
    Resolver = require('y-resolver'),

    hook = require('../hook.js');

Object.prototype[define](hook,function(parent,sibling){
  var txt,elem,ctrl,col;

  if(typeof this.controller == 'function' && typeof this.view == 'function'){
    col = new Collection();
    ctrl = new this.controller(this,col);
    
    elem = this.view(ctrl,this)[hook]();
    elem[collection].add(col);

    if(!parent) parent = elem;
    else if(sibling) parent.insertBefore(elem,sibling);
    else parent.appendChild(elem);

    return parent;
  }

  if(!parent) parent = document.createElement('div');

  if(this.view && this.controller){

    if(!sibling){
      sibling = document.createTextNode('');
      parent.appendChild(sibling);
    }

    Resolver.all([this.controller,this.view]).listen(listener,[parent,this,sibling]);
    return parent;
  }

  if(Getter.is(this)){
    txt = document.createTextNode('');
    txt[collection].add(this.connect(txt,'textContent'));
    parent.appendChild(txt);
    return parent;
  }

  parent[apply](this,parent[collection]);
  return parent;

},{writable: true});

function listener(parent,that,sibling){
  that.controller = this.value[0];
  that.view = this.value[1];
  that[hook](parent,sibling);
}
