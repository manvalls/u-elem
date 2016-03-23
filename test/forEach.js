var t = require('u-test'),
    assert = require('assert'),
    Setter = require('y-setter'),
    wait = require('y-timers/wait'),
    x = require('../main.js'),
    forEach = require('../hooks/forEach.js');

t('forEach',function(){

  t('Getter',function(){
    var setter = new Setter([]),
        d;

    d = x('div','foo',forEach(setter.getter,(n,index) => ['span',`${n},`,index]),'bar');
    assert.strictEqual(d.innerHTML,'foobar');

    setter.value = [1,2,3];
    assert.strictEqual(d.innerHTML,'foo<span>1,0</span><span>2,1</span><span>3,2</span>bar');

    setter.value.splice(1,1);
    setter.update();
    assert.strictEqual(d.innerHTML,'foo<span>1,0</span><span>3,1</span>bar');

    d = x(forEach(setter.getter,n => ['span',n + '']));
    assert.strictEqual(d.tagName,'DIV');

    setter.value.splice(1,0,2);
    setter.update();

    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');

    setter.value.splice(0,2);
    setter.update();

    assert.strictEqual(d.innerHTML,'<span>3</span>');
  });

  t('Getter with timeout',function*(){
    var setter = new Setter(['1','2','3']),
        d = x(forEach(setter.getter,str => ['span',str],500));

    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');
    setter.value = [];
    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');

    yield wait(200);
    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');

    yield wait(500);
    assert.strictEqual(d.innerHTML,'');

    setter.value = ['1','2','3'];
    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');
    setter.value = ['1','2'];
    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');
    yield wait(200);
    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');
    setter.value = ['1','2','3'];
    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');
    yield wait(500);
    assert.strictEqual(d.innerHTML,'<span>1</span><span>2</span><span>3</span>');

  });

});
