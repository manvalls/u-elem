var t = require('u-test'),
    assert = require('assert'),
    wait = require('y-timers/wait'),
    x = require('../../main.js'),
    Setter = require('y-setter'),
    destroy = require('../../destroy.js');

t('destroy',function*(){
  var setter = new Setter(),
      d,i;

  setter.value = true;

  d = x('div');
  x(d,
    i = x(['input',{type: 'checkbox'}, {checked: setter, foo: setter.getter}])
  );

  assert.strictEqual(i.checked,true);
  i.click();
  yield wait(10);
  assert.strictEqual(setter.value,false);
  assert.strictEqual(i.foo,false);

  d[destroy]();
  i.click();
  yield wait(10);
  assert.strictEqual(setter.value,false);
  assert.strictEqual(i.foo,false);

});
