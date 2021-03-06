# Elem [![Build Status][ci-img]][ci-url] [![Coverage Status][cover-img]][cover-url]

```javascript
var x = require('u-elem'),
    on = require('u-elem/on');

x('body',
  {draggable: false, className: 'foo'},
  'Hello world!',
  ['span',
    on('click',e => console.log('click!')),
    {style: {color: 'green', textAlign: 'center'}},
    'Hi again!'
  ]
);

console.log(document.body.innerHTML);
// Hello world!<span style="color: green; text-align: center;">Hi again!</span>

console.log(document.body.draggable); // false
```

*Elem* is a parser of a custom [JsonML](http://www.jsonml.org/) variant, based in the DOM rather than the HTML markup. It uses internally `u-proto`'s [apply](https://www.npmjs.com/package/u-proto), which means that all of its goodies are directly integrated into *Elem*. Well, that's its default behavior, you can change it: *Elem* is both extensible and configurable.

What *Elem* does is just call the internal `[hook]` method of provided objects. Well, in fact all it does is call `Array.prototype[hook]`:

```javascript
function x(){
  return Array.prototype[hook].call(arguments);
}
```

The `Array` hook in turn calls the hook of the first element without arguments, expecting a `Node` to be returned. This node will be the argument passed to the hooks of the remaining elements, and that's all. But then again, that's just the default `Array` hook included with *Elem*, feel free to change it if you want. To illustrate these hook functions, we'll take a look at the default `Node` hook:

```javascript
var define = require('u-proto/define'),
    hook = require('../hook.js');

Node.prototype[define](hook,function(parent){
  if(parent) parent.appendChild(this);
  return this;
});
```

Now imagine you've got an array like this:

```javascript
[
  document.body,
  document.createTextNode('foo'),
  document.createTextNode('bar')
]
```

The `Array` hook would run the hook of `document.body` without arguments, which would do nothing but return `document.body` itself. Then, it would run the hook of `foo` and `bar` with `document.body` as the only argument and ignore returned values. In the end, our body would end up looking like this, assuming it was previously empty:

```html
<body>foobar</body>
```

You may want to take a look at [on.js](on.js) to see how hooks may be used to do interesting things, such as calling `addEventListener` in the middle of the parsing process. Another cool hook is `when`:

```javascript
var x = require('u-elem'),
    when = require('u-elem/when'),
    H = require('y-setter').Hybrid,

    h = new H(),
    d = x('div',
      when(h,['span','Yes!']).else(['span','No!'])
    );

h.value = true;
console.log(d.innerHTML); // <span>Yes!</span>

h.value = false;
console.log(d.innerHTML); // <span>No!</span>
```

One thing remains: the cleanup. Each node gets assigned a `detacher` to its `require('u-elem/detacher')` property. *Elem* ships with a utility method to detach an element's detacher and all of its children, use it when you're done with a node, like this:

```javascript
var x = require('u-elem'),
    destroy = require('u-elem/destroy'),
    d = x('div');

//...

d[destroy]();
```

Or listen to a detacher to do your cleanup:

```javascript
var x = require('u-elem'),
    detacher = require('u-elem/detacher'),
    d = x('div');

//...

d[detacher].then(function(){
  // do your cleanup
});
```

And lastly, a note on variable names. You can see here that an `x` is used as the variable name of *Elem*. It was originally `elem`, but it was larger and less cool. One of the beauties of modules is that you can name things however you like without polluting the global namespace. Feel free to name it `x`, `elem`, `$`, `_` or even `ಠ_ಠ`. And for those of you not using modules, please stop doing so. Or, you know, just call it `x`.

[ci-img]: https://circleci.com/gh/manvalls/u-elem.svg?style=shield
[ci-url]: https://circleci.com/gh/manvalls/u-elem
[cover-img]: https://coveralls.io/repos/manvalls/u-elem/badge.svg?branch=master&service=github
[cover-url]: https://coveralls.io/github/manvalls/u-elem?branch=master
