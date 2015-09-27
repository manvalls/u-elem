Object.setPrototypeOf(global,require('jsdom').jsdom().defaultView);

var x = require('../main.js'),
    on = require('../on.js'),
    onNot = require('../onNot.js'),
    once = require('../once.js'),
    onceNot = require('../onceNot.js'),
    when = require('../when.js'),
    whenNot = require('../whenNot.js'),
    destroy = require('../destroy.js'),
    Setter = require('y-setter'),
    Resolver = require('y-resolver'),
    wait = require('y-timers/wait'),
    tick = require('y-timers/tick'),
    Rul = require('rul'),
    forEach = require('../forEach.js'),

    t = require('u-test'),
    assert = require('assert');

t('Element creation and appending',function(){
  var e;

  document.body.innerHTML = '';

  x(null,'body',
    {style: {color: 'black'}},
    'Hello world!',
    null,Object.create(null),
    [
      {style: {color: 'green'}},
      'Hi again!'
    ]
  );

  assert.strictEqual(document.body.innerHTML,'Hello world!<div style="color: green;">Hi again!</div>');
  assert.strictEqual(document.body.style.color,'black');
  assert.strictEqual(x(['div',[]]).innerHTML,'<div></div>');
});

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

t('MVC',function(){

  t('Non-yieldeds',function(){
    var d = x({
      view: require('./main/view'),
      controller: require('./main/controller'),
      foo: 'bar'
    }),obj;

    assert.strictEqual(d.innerHTML,'bar');

    d = x({
      view: require('./main/view'),
      controller: require('./main/controller'),
      foo: 'foo'
    });

    assert.strictEqual(d.innerHTML,'foo');

    d = x('div',obj = {
      view: require('./main/view'),
      controller: require('./main/controller'),
      foo: 'foo'
    });

    assert.strictEqual(d.innerHTML,'<div>foo</div>');

    assert(!obj.done);
    d[destroy]();
    assert(obj.done);
  });

  t('Yieldeds',function*(){
    var d = x({
      view: tick(require('./main/view')),
      controller: wait(10,require('./main/controller')),
      foo: 'bar'
    },'foo');

    yield wait(20);
    assert.strictEqual(d.innerHTML,'<div>bar</div>foo');

    d = x({
      view: tick(require('./main/view')),
      controller: require('./main/controller'),
      foo: 'foo'
    });

    yield tick();
    yield tick();
    assert.strictEqual(d.innerHTML,'<div>foo</div>');

    d = x('span','foo',{
      view: require('./main/view'),
      controller: tick(Promise.accept(require('./main/controller'))),
      foo: 'foo'
    },'bar');

    yield wait(15);
    assert.strictEqual(d.innerHTML,'foo<div>foo</div>bar');
  });

});

t('on',function*(){
  var setter = new Setter('red'),
      getter = setter.getter,
      n = 0,
      d = x([
        on('click',() => void n++),
        on('click',() => void n++,true)
      ]);

  d.click();
  assert.strictEqual(n,2);
  assert.strictEqual(d.tagName,'DIV');

  d[destroy]();
  d.click();
  assert.strictEqual(n,2);

  d = x([
    on('click',() => ['div','foo','bar']),
    on('click',{style: {color: 'black'}})
  ]);

  assert.strictEqual(d.innerHTML,'');
  assert(!d.style.color);
  d.click();
  assert.strictEqual(d.style.color,'black');
  assert.strictEqual(d.innerHTML,'<div>foobar</div>');
  d.click();
  assert.strictEqual(d.innerHTML,'<div>foobar</div><div>foobar</div>');

  d = x([
    on(getter,(v) => ['span',v]),
    on(wait(0),{style: {color: 'black'}}),
    on(Resolver.reject(),(v) => ['span',v])
  ]);

  assert.strictEqual(d.innerHTML,'<span>red</span>');
  setter.value = 'brown';
  assert.strictEqual(d.innerHTML,'<span>red</span><span>brown</span>');

  yield wait(100);
  assert.strictEqual(d.style.color,'black');
  setter.value = 'black';
  setter.value = false;
  assert.strictEqual(d.innerHTML,'<span>red</span><span>brown</span><span>black</span>');

  d[destroy]();
  setter.value = 'red';
  assert.strictEqual(d.innerHTML,'<span>red</span><span>brown</span><span>black</span>');
});

t('once',function*(){
  var setter = new Setter(),
      getter = setter.getter,
      n = 0,
      d = x([
        once('click',() => void n++),
        once('click',() => void n++,true)
      ]);

  d.click();
  d.click();
  d.click();
  assert.strictEqual(n,2);
  assert.strictEqual(d.tagName,'DIV');

  d[destroy]();
  d.click();
  assert.strictEqual(n,2);

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
    once(Resolver.reject(),(v) => ['span',v])
  ]);

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

t('onNot',function(){

  t('Getter',function(){
    var setter = new Setter(),
        getter = setter.getter,
        d;

    d = x(['div',onNot(getter,['span','foo'])]);
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    setter.value = true;
    setter.value = 1;
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    setter.value = false;
    setter.value = 0;
    setter.value = null;
    assert.
      strictEqual(d.innerHTML,'<span>foo</span><span>foo</span><span>foo</span><span>foo</span>');


  });

  t('Yielded',function(){
    var d;

    d = x([onNot(Resolver.reject(),['span','foo'])]);
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    d = x([onNot(Resolver.accept(),['span','foo'])]);
    assert.strictEqual(d.innerHTML,'');
  });

  t('Neither',function(){
    var d;

    d = x([onNot('click',['span','foo'])]);
    d.click();
    assert.strictEqual(d.innerHTML,'');
  });

});

t('onceNot',function(){

  t('Getter',function(){
    var setter = new Setter(),
        getter = setter.getter,
        d;

    d = x(['div',onceNot(getter,['span','foo'])]);
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    setter.value = true;
    setter.value = 1;
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    setter.value = false;
    setter.value = 0;
    setter.value = null;
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    setter.value = true;
    d = x(['div',onceNot(getter,['span','foo'])]);
    assert.strictEqual(d.innerHTML,'');
  });

  t('Yielded',function(){
    var d;

    d = x([onceNot(Resolver.reject(),['span','foo'])]);
    assert.strictEqual(d.innerHTML,'<span>foo</span>');

    d = x([onceNot(Resolver.accept(),['span','foo'])]);
    assert.strictEqual(d.innerHTML,'');
  });

  t('Neither',function(){
    var d;

    d = x([onceNot('click',['span','foo'])]);
    d.click();
    assert.strictEqual(d.innerHTML,'');
  });

});

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
});

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

t('forEach',function(){

  t('rul',function(){
    var rul = new Rul(),
        d = x('div','foobar');

    rul.append([1,2,3]);
    x(d,forEach(rul,n => ['span',n + '']));

    assert.strictEqual(d.innerHTML,'foobar<span>1</span><span>2</span><span>3</span>');

    rul.remove(1);
    assert.strictEqual(d.innerHTML,'foobar<span>1</span><span>3</span>');

    d = x(forEach(rul,n => ['span',n + '']));
    assert.strictEqual(d.tagName,'DIV');

    rul.add(2,1);
    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');

    rul.remove(0,2);
    assert.strictEqual(d.innerHTML,'<span>3</span>');

    rul.append([4,5,6]);
    rul.swap(2,1);
    assert.strictEqual(d.innerHTML,'<span>3</span><span>5</span><span>4</span><span>6</span>');

    rul.move(0,3);
    assert.strictEqual(d.innerHTML,'<span>5</span><span>4</span><span>6</span><span>3</span>');
  });

  t('rul with timeout',function*(){
    var rul = new Rul(),
        d = x(forEach(rul,str => ['span',str],500));

    rul.append(['1','2','3']);
    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');
    rul.clear();
    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');

    yield wait(400);
    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');

    yield wait(150);
    assert.strictEqual(d.innerHTML,'');
  });

  t('Array',function(){
    var d = x('div',
      forEach([1,2,3,4],(n) => ['span',`${n}`])
    );

    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span><span>4</span>');
  });

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
