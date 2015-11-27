var t = require('u-test'),
    assert = require('assert'),
    Setter = require('y-setter'),
    Resolver = require('y-resolver'),
    x = require('../main.js'),
    onceNot = require('../onceNot.js');

t('onceNot',function(){

  t('Getter',function(){
    var setter = new Setter(),
        getter = setter.getter,
        d;

    d = x(['div',onceNot(getter,['span','foo'])]);
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    setter.value = true;
    setter.value = 1;
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    setter.value = false;
    setter.value = 0;
    setter.value = null;
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    setter.value = true;
    d = x(['div',onceNot(getter,['span','foo'])]);
    assert.strictEqual(d.innerHTML,'');
  });

  t('Yielded',function(){
    var d;

    d = x([onceNot(Resolver.reject(),['span','foo'])]);
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    d = x([onceNot(Resolver.accept(),['span','foo'])]);
    assert.strictEqual(d.innerHTML,'');
  });

  t('Neither',function(){
    var d;

    d = x([onceNot('click',['span','foo'])]);
    d.click();
    assert.strictEqual(d.innerHTML,'');
  });

});
