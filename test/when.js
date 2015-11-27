var t = require('u-test'),
    assert = require('assert'),
    x = require('../main.js'),
    wait = require('y-timers/wait'),
    Setter = require('y-setter'),
    destroy = require('../destroy.js'),
    when = require('../when.js');

t('when',function(){

  t('Getter',function(){
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

  t('Getter with timeout',function*(){
    var setter = new Setter(),
        getter = setter.getter,
        d;

    setter.value = true;
    d = x('div',
      when(getter,['span','foo'],500)
    );

    assert.strictEqual(d.innerHTML,'<span>foo</span>');
    setter.value = false;
    yield wait(100);
    assert.strictEqual(d.innerHTML,'<span>foo</span>');
    yield wait(450);
    assert.strictEqual(d.innerHTML,'');

    setter.value = true;
    assert.strictEqual(d.innerHTML,'<span>foo</span>');
    setter.value = false;

    yield wait(100);
    setter.value = true;
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    yield wait(450);
    assert.strictEqual(d.innerHTML,'<span>foo</span>');


  });

  t('Non-getter',function(){
    var d = x('div',
      when(true,['span','foo']),
      when(false,['span','bar'])
    );

    assert.strictEqual(d.innerHTML,'<span>foo</span>');
  });

});
