const path = require('path');
const NginxExecutor = require('../src/index.js');

const nginx = new NginxExecutor({
  config: path.resolve(__dirname, './nginx.conf'),
});

nginx.start();
