var t = require('u-test'),
    Setter = require('y-setter'),
    assert = require('assert'),
    x = require('../../main.js'),
    destroy = require('../../destroy.js');

t('Getter hook',function(){
  var setter = new Setter(''),
      getter = setter.getter,
      s;

  s = x(['div',['span',getter]]);
  assert.strictEqual(s.innerHTML,'<span></span>');

  setter.value = 'foo';
  assert.strictEqual(s.innerHTML,'<span>foo</span>');

  s[destroy]();
  setter.value = 'bar';
  assert.strictEqual(s.innerHTML,'<span>foo</span>');
});
