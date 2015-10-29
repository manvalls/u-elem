var define = require('u-proto/define'),
    apply = require('u-proto/apply'),
    walk = require('y-walk'),
    collection = require('../collection'),
    Collection = require('detacher/collection'),
    Getter = require('y-setter').Getter,
    Resolver = require('y-resolver'),
    Yielded = Resolver.Yielded,

    hook = require('../hook.js');

Object.prototype[define](hook,function(parent){
  return hookFn(this,parent);
},{writable: true});

function hookFn(that,parent,sibling){
  var txt,elem,ctrl,col,ref;

  if(Yielded.is(that)){

    if(that.done){
      if(that.value && that.value[hook]) return that.value[hook](parent);
      return parent || document.createElement('div');
    }

    ref = document.createTextNode('');
    parent = parent || document.createElement('div');
    parent.appendChild(ref);

    that.listen(ydListener,[parent,ref]);
    return parent;
  }

  if(typeof that.controller == 'function' && typeof that.view == 'function'){
    col = new Collection();
    ctrl = new that.controller(that,col);

    elem = that.view[hook](null,[ctrl,that],that);
    elem[collection].add(col);

    if(!parent) parent = elem;
    else if(sibling) parent.insertBefore(elem,sibling);
    else parent.appendChild(elem);

    return parent;
  }

  if(!parent) parent = document.createElement('div');

  if(that.view && that.controller){

    if(!sibling){
      sibling = document.createTextNode('');
      parent.appendChild(sibling);
    }

    Resolver.all([that.controller,that.view]).listen(listener,[parent,that,sibling]);
    return parent;
  }

  if(Getter.is(that)){
    txt = document.createTextNode('');
    txt[collection].add(that.connect(txt,'textContent'));
    parent.appendChild(txt);
    return parent;
  }

  parent[apply](that,parent[collection]);
  return parent;

}

function listener(parent,that,sibling){
  that.controller = this.value[0];
  that.view = this.value[1];
  hookFn(that,parent,sibling);
}

function ydListener(parent,ref){
  var elem;

  if(this.value && this.value[hook]){
    elem = this.value[hook]();
    parent.insertBefore(elem,ref);
  }

}
