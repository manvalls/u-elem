Object.setPrototypeOf(global,require('jsdom').jsdom().defaultView);

var x = require('../main.js'),
    on = require('../on.js'),
    when = require('../when.js'),
    whenNot = require('../whenNot.js'),
    destroy = require('../destroy.js'),
    Setter = require('y-setter'),
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
    null,Object.create(null),[],
    [
      {style: {color: 'green'}},
      'Hi again!'
    ]
  );

  assert.strictEqual(document.body.innerHTML,'Hello world!<div style="color: green;">Hi again!</div>');
  assert.strictEqual(document.body.style.color,'black');
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

t('on',function(){
  var n = 0,
      d = x([
        on('click',() => n++),
        on('click',() => n++,true)
      ]);

  d.click();
  assert.strictEqual(n,2);
  assert.strictEqual(d.tagName,'DIV');

  d[destroy]();
  d.click();
  assert.strictEqual(n,2);
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

t('forEach',function(){
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
