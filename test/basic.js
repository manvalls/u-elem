var t = require('u-test'),
    assert = require('assert'),
    x = require('../main.js');

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
