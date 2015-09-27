var t = require('u-test'),
    assert = require('assert'),
    Rul = require('rul'),
    wait = require('y-timers/wait'),
    x = require('../../main.js'),
    forEach = require('../../forEach.js');

t('forEach',function(){

  t('rul',function(){
    var rul = new Rul(),
        d;

    d = x('div','foo',forEach(rul,n => ['span',`${n}`]),'bar');
    assert.strictEqual(d.innerHTML,'foobar');

    rul.append([1,2,3]);
    assert.strictEqual(d.innerHTML,'foo<span>1</span><span>2</span><span>3</span>bar');

    rul.remove(1);
    assert.strictEqual(d.innerHTML,'foo<span>1</span><span>3</span>bar');

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
