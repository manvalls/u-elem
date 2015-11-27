var t = require('u-test'),
    assert = require('assert'),
    x = require('../main.js'),
    destroy = require('../destroy.js'),
    tick = require('y-timers/tick'),
    wait = require('y-timers/wait');

t('MVC',function(){

  t('Non-yieldeds',function(){
    var d = x({
      view: require('./mvc/view'),
      controller: require('./mvc/controller'),
      foo: 'bar'
    }),obj;

    assert.strictEqual(d.innerHTML,'bar');

    d = x({
      view: require('./mvc/view'),
      controller: require('./mvc/controller'),
      foo: 'foo'
    });

    assert.strictEqual(d.innerHTML,'foo');

    d = x('div',obj = {
      view: require('./mvc/view'),
      controller: require('./mvc/controller'),
      foo: 'foo'
    });

    assert.strictEqual(d.innerHTML,'<div>foo</div>');

    assert(!obj.done);
    d[destroy]();
    assert(obj.done);
  });

  t('Yieldeds',function*(){
    var d = x({
      view: tick(require('./mvc/view')),
      controller: wait(10,require('./mvc/controller')),
      foo: 'bar'
    },'foo');

    yield wait(100);
    assert.strictEqual(d.innerHTML,'<div>bar</div>foo');

    d = x({
      view: tick(require('./mvc/view')),
      controller: require('./mvc/controller'),
      foo: 'foo'
    });

    yield tick();
    yield tick();
    assert.strictEqual(d.innerHTML,'<div>foo</div>');

    d = x('span','foo',{
      view: require('./mvc/view'),
      controller: tick(Promise.resolve(require('./mvc/controller'))),
      foo: 'foo'
    },'bar');

    yield wait(100);
    assert.strictEqual(d.innerHTML,'foo<div>foo</div>bar');
  });

});
