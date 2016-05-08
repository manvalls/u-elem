var t = require('u-test'),
    assert = require('assert'),
    x = require('../main.js'),
    wait = require('y-timers/wait'),
    Setter = require('y-setter'),
    Yielded = require('y-resolver').Yielded,
    destroy = require('../destroy.js'),
    when = require('../hooks/when.js');

t('when',function(){

  t('else',function(){
    var s = new Setter(),
        g = s.getter,
        s2 = new Setter(),
        g2 = s2.getter;
        d = x('div',
          when(g,['span','yes'])
          .elseWhen(g2,['span','2'])
          .else(['span','no'])
        );

    assert.strictEqual(d.innerHTML,'<span>no</span>');
    s.value = true;
    assert.strictEqual(d.innerHTML,'<span>yes</span>');
    s.value = false;
    assert.strictEqual(d.innerHTML,'<span>no</span>');
    s2.value = true;
    assert.strictEqual(d.innerHTML,'<span>2</span>');

  });

  t('Getter',function(){
    var s1 = new Setter(),
        g1 = s1.getter,
        s2 = new Setter(),
        g2 = s2.getter,
        d = x(
          when(g1,['span',
            'Hi!',g1
          ]),
          when(g2,['span',
            'Ho!'
          ])
        );

    assert.strictEqual(d.innerHTML,'');
    s1.value = !s1.value;
    assert.strictEqual(d.innerHTML,'<span>Hi!true</span>');
    s2.value = !s2.value;
    s1.value = 'foo';
    assert.strictEqual(d.innerHTML,'<span>Hi!foo</span><span>Ho!</span>');
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
      when(getter,['span','foo'],{removalTimeout: 500})
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
      when({[Yielded.getter]: null},['span','foo']),
      when(false,['span','bar'])
    );

    assert.strictEqual(d.innerHTML,'<span>foo</span>');
  });

});
