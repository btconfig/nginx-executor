# nginx-executor

start a nginx server.

when config is changed, the nginx server will reload automaticly.

## install

```bash
npm install nginx-executor -D
```

## start a server

```js
const path = require('path');
const NginxExecutor = require('nginx-executor');

const nginx = new NginxExecutor({
  config: path.resolve(__dirname, './nginx.conf'),
});

nginx.start();
```

## stop a server

```js
// same code like start a server
nginx.stop();
```

## reload a server

```js
// same code like start a server
nginx.reload();
```
