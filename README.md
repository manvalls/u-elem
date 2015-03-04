# Elem

## Sample usage

```javascript
var elem = require('u-elem'),
    div;

div = elem(['div','hi',{style: {color: 'black'}}]);
document.body.appendChild(div);

elem([document.body,
  'Foo!',
  ['input',
    {
      type: 'button',
      style: {
        width: '30px',
        height: '10px'
      }
    }
  ]
]);
```
