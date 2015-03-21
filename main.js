var apply = require('u-proto/apply'),
    elem;

elem = module.exports = function(jsonml,g){
  var i,ret,document,Node;
  
  g = g || global;
  document = g.document || global.document;
  Node = g.Node || global.Node;
  
  if(jsonml[0] instanceof Node) ret = jsonml[0];
  else ret = document.createElement(jsonml[0]);
  
  for(i = 1;i < jsonml.length;i++){
    if(jsonml[i] instanceof Node) ret.appendChild(jsonml[i]);
    else switch(jsonml[i].constructor){
      
      case Array:
        ret.appendChild(elem(jsonml[i]));
        break;
      
      case Object:
        ret[apply](jsonml[i]);
        break;
      
      default:
        ret.appendChild(document.createTextNode(jsonml[i].toString()));
        break;
        
    }
  }
  
  return ret;
};

elem.frag = function(g){
  g = g || global;
  return g.document.createDocumentFragment();
};

elem.txt = function(txt,g){
  g = g || global;
  return g.document.createTextNode(txt);
};

