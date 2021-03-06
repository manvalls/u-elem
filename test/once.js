var t = require('u-test'),
    assert = require('assert'),
    Setter = require('y-setter'),
    Resolver = require('y-resolver'),
    x = require('../main.js'),
    once = require('../hooks/once.js'),
    destroy = require('../destroy.js'),
    wait = require('y-timers/wait');

t('once',function*(){
  var setter = new Setter(),
      getter = setter.getter,
      n = 0,
      d = x([
        once('window.click',() => void n++),
        once('click',() => void n++),
        once(destroy,{foo: 'bar'})
      ]);

  x('body',d);

  d.click();
  d.click();
  d.click();
  assert.strictEqual(n,2);
  assert.notStrictEqual(d.foo,'bar');
  assert.strictEqual(d.tagName,'DIV');

  d[destroy]();
  assert.strictEqual(d.foo,'bar');
  d.click();
  assert.strictEqual(n,2);
  d.remove();

  d = x([
    once('click',() => ['div','foo','bar']),
    once('click',{style: {color: 'black'}})
  ]);

  assert.strictEqual(d.innerHTML,'');
  assert(!d.style.color);
  d.click();
  assert.strictEqual(d.style.color,'black');
  assert.strictEqual(d.innerHTML,'<div>foobar</div>');
  d.click();
  assert.strictEqual(d.innerHTML,'<div>foobar</div>');

  d = x([
    once(getter,(v) => ['span',v]),
    once(wait(0),{style: {color: 'black'}}),
    once({[Resolver.Yielded.getter]: null},{style: {margin: '0px'}}),
    once(false,{style: {margin: '5px'}}),
    once(Resolver.reject(),(v) => ['span',v])
  ]);

  assert.strictEqual(d.style.margin,'0px');
  assert.strictEqual(d.innerHTML,'');
  setter.value = 'brown';
  assert.strictEqual(d.innerHTML,'<span>brown</span>');
  setter.value = 'red';
  assert.strictEqual(d.innerHTML,'<span>brown</span>');

  yield wait(100);
  assert.strictEqual(d.style.color,'black');
  setter.value = 'black';
  setter.value = false;
  assert.strictEqual(d.innerHTML,'<span>brown</span>');

  d[destroy]();
  setter.value = 'red';
  assert.strictEqual(d.innerHTML,'<span>brown</span>');
});
