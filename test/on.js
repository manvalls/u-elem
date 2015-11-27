var t = require('u-test'),
    assert = require('assert'),
    Setter = require('y-setter'),
    Resolver = require('y-resolver'),
    x = require('../main.js'),
    on = require('../on.js'),
    destroy = require('../destroy.js'),
    wait = require('y-timers/wait');

t('on',function*(){
  var setter = new Setter('red'),
      getter = setter.getter,
      n = 0,
      d = x([
        on('click',() => void n++),
        on('click',() => void n++,true)
      ]);

  d.click();
  assert.strictEqual(n,2);
  assert.strictEqual(d.tagName,'DIV');

  d[destroy]();
  d.click();
  assert.strictEqual(n,2);

  d = x([
    on('click',() => ['div','foo','bar']),
    on('click',{style: {color: 'black'}})
  ]);

  assert.strictEqual(d.innerHTML,'');
  assert(!d.style.color);
  d.click();
  assert.strictEqual(d.style.color,'black');
  assert.strictEqual(d.innerHTML,'<div>foobar</div>');
  d.click();
  assert.strictEqual(d.innerHTML,'<div>foobar</div><div>foobar</div>');

  d = x([
    on(getter,(v) => ['span',v]),
    on(wait(0),{style: {color: 'black'}}),
    on(Resolver.reject(),(v) => ['span',v])
  ]);

  assert.strictEqual(d.innerHTML,'<span>red</span>');
  setter.value = 'brown';
  assert.strictEqual(d.innerHTML,'<span>red</span><span>brown</span>');

  yield wait(100);
  assert.strictEqual(d.style.color,'black');
  setter.value = 'black';
  setter.value = false;
  assert.strictEqual(d.innerHTML,'<span>red</span><span>brown</span><span>black</span>');

  d[destroy]();
  setter.value = 'red';
  assert.strictEqual(d.innerHTML,'<span>red</span><span>brown</span><span>black</span>');
});
