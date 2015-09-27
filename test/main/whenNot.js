var t = require('u-test'),
    assert = require('assert'),
    x = require('../../main.js'),
    wait = require('y-timers/wait'),
    Setter = require('y-setter'),
    destroy = require('../../destroy.js'),
    whenNot = require('../../whenNot.js');

t('whenNot',function(){

  t('Getter',function(){
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

  t('Getter with timeout',function*(){
    var setter = new Setter(),
        getter = setter.getter,
        d;

    setter.value = false;
    d = x('div',
      whenNot(getter,['span','foo'],500)
    );

    assert.strictEqual(d.innerHTML,'<span>foo</span>');
    setter.value = true;
    yield wait(100);
    assert.strictEqual(d.innerHTML,'<span>foo</span>');
    yield wait(450);
    assert.strictEqual(d.innerHTML,'');

    setter.value = false;
    assert.strictEqual(d.innerHTML,'<span>foo</span>');
    setter.value = true;

    yield wait(100);
    setter.value = false;
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    yield wait(450);
    assert.strictEqual(d.innerHTML,'<span>foo</span>');


  });

  t('Non-getter',function(){
    var d = x('div',
      whenNot(true,['span','foo']),
      whenNot(false,['span','bar'])
    );

    assert.strictEqual(d.innerHTML,'<span>bar</span>');
  });

});
