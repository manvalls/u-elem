var t = require('u-test'),
    assert = require('assert'),
    x = require('../main.js'),
    wait = require('y-timers/wait');

t('Function hook',function*(){
  var d = x(['div',function*(){
    e = this;
    yield wait(0);
    return ['span','foo'];
  }]),e;

  assert.strictEqual(e,d);
  assert.strictEqual(d.innerHTML,'');
  yield wait(100);
  assert.strictEqual(d.innerHTML,'<span>foo</span>');

  assert.strictEqual(x(()=>null).tagName,'DIV');

  d = x(function*(){
    yield wait(0);
  });

  assert.strictEqual(d.innerHTML,'');
  assert.strictEqual(d.tagName,'DIV');
  yield wait(100);
  assert.strictEqual(d.innerHTML,'');

  d = x(Promise.resolve(['span','hi']));

  assert.strictEqual(d.innerHTML,'');
  yield wait(10);
  assert.strictEqual(d.innerHTML,'<span>hi</span>');
});
