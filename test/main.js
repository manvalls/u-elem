Object.setPrototypeOf(global,require('jsdom').jsdom().defaultView);

var x = require('../main.js'),
    on = require('../on.js'),
    when = require('../when.js'),
    whenNot = require('../whenNot.js'),
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

t('when',function(){
  var s1 = new Setter(),
      g1 = s1.getter,
      s2 = new Setter(),
      g2 = s2.getter,
      d = x(
        when(g1,['span',
          'Hi!'
        ]),
        when(g2,['span',
          'Ho!'
        ])
      );

  assert.strictEqual(d.innerHTML,'');
  s1.value = !s1.value;
  assert.strictEqual(d.innerHTML,'<span>Hi!</span>');
  s2.value = !s2.value;
  assert.strictEqual(d.innerHTML,'<span>Hi!</span><span>Ho!</span>');
  s1.value = !s1.value;
  assert.strictEqual(d.innerHTML,'<span>Ho!</span>');
  s1.value = 0;
  s2.value = 0;
  assert.strictEqual(d.innerHTML,'');

  d[destroy]();
  s1.value = !s1.value;
  s2.value = !s2.value;
  assert.strictEqual(d.innerHTML,'');

});

t('whenNot',function(){
  var s1 = new Setter(),
      g1 = s1.getter,
      s2 = new Setter(),
      g2 = s2.getter,
      d = x(
        whenNot(g1,['span',
          'Hi!'
        ]),
        whenNot(g2,['span',
          'Ho!'
        ])
      );

  assert.strictEqual(d.innerHTML,'<span>Hi!</span><span>Ho!</span>');
  s1.value = !s1.value;
  assert.strictEqual(d.innerHTML,'<span>Ho!</span>');
  s2.value = !s2.value;
  assert.strictEqual(d.innerHTML,'');
  s1.value = !s1.value;
  assert.strictEqual(d.innerHTML,'<span>Hi!</span>');
  s1.value = 0;
  s2.value = 0;
  assert.strictEqual(d.innerHTML,'<span>Hi!</span><span>Ho!</span>');

  d[destroy]();
  s1.value = !s1.value;
  s2.value = !s2.value;
  assert.strictEqual(d.innerHTML,'<span>Hi!</span><span>Ho!</span>');

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
