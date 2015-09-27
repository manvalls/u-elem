Object.setPrototypeOf(global,require('jsdom').jsdom().defaultView);

require('./main/basic.js');
require('./main/getter.js');
require('./main/mvc.js');
require('./main/on.js');
require('./main/once.js');
require('./main/onNot.js');
require('./main/onceNot.js');
require('./main/function.js');
require('./main/when.js');
require('./main/whenNot.js');
require('./main/forEach.js');
require('./main/destroy.js');
