Object.setPrototypeOf(global,require('jsdom').jsdom().defaultView);

var x = require('../main.js'),
    on = require('../on.js'),
    destroy = require('../destroy.js'),
    Setter = require('y-setter'),
    wait = require('y-timers/wait'),

    t = require('u-test'),
    assert = require('assert');

t('Element creation and appending',function(){
  var e;

  document.body.innerHTML = '';

  x(null,'body',
    {style: {color: 'black'}},
    'Hello world!',
    null,Object.create(null),[],
    [
      {style: {color: 'green'}},
      'Hi again!'
    ]
  );

  assert.strictEqual(document.body.innerHTML,'Hello world!<div style="color: green;">Hi again!</div>');
  assert.strictEqual(document.body.style.color,'black');
});

t('on',function(){
  var n = 0,
      d = x([
        on('click',() => n++),
        on('click',() => n++,true)
      ]);

  d.click();
  assert.strictEqual(n,2);
  assert.strictEqual(d.tagName,'DIV');
});

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
