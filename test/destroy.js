var t = require('u-test'),
    assert = require('assert'),
    wait = require('y-timers/wait'),
    x = require('../main.js'),
    Setter = require('y-setter'),
    destroy = require('../destroy.js');

t('destroy',function*(){
  var setter = new Setter(),
      d,i;

  setter.value = true;

  d = x('div');
  x(d,
    i = x(['input',{type: 'checkbox'}, {checked: setter, foo: setter.getter}])
  );

  x('body',d);

  t('Input initially checked',function(){
    assert.strictEqual(i.checked,true);
  });

  yield t('Input unchecked after click',function*(){
    i.click();
    yield wait(100);
    assert.strictEqual(setter.value,false);
    assert.strictEqual(i.foo,false);
  });

  t('Clicks have no effect after destruction',function*(){
    d[destroy]();
    i.click();
    yield wait(100);
    assert.strictEqual(setter.value,false);
    assert.strictEqual(i.foo,false);
  });

});
