const cp = require('child_process');
const fs = require('fs');

const { spawn } = cp;
const { existsSync } = fs;

function NginxExecutor(options = {}) {
  if (options.config && !existsSync(options.config)) {
    throw new Error(`config path: ${options.config} does not exist`);
  }
  if (options.prefix && !existsSync(options.prefix)) {
    throw new Error(`prefix path: ${options.prefix} does not exist`);
  }
  this.options = { command: 'nginx', ...options };
}

NginxExecutor.prototype.arguments = function () {
  const args = [];
  const { config, prefix } = this.options;
  if (config) {
    args.push('-c', config);
  }
  if (prefix) {
    args.push('-p', config);
  }
  args.push('-g', 'error_log stderr notice;');
  return args;
};

NginxExecutor.prototype.start = function () {
  const { command } = this.options;
  const args = this.arguments();
  const nginx = spawn(command, args);
  nginx.stdout.on('data', function (buf) {
    console.log(buf.toString());
  });
  nginx.stderr.on('data', function (buf) {
    console.log(buf.toString());
  });
  this.watchConfig();
};

NginxExecutor.prototype.stop = function () {
  const { command } = this.options;
  spawn(command, ['-s', 'stop']);
};

NginxExecutor.prototype.reload = function () {
  const { command } = this.options;
  spawn(command, ['-s', 'reload']);
};

NginxExecutor.prototype.watchConfig = function () {
  if (!this.options.config) {
    return;
  }
  let timer = null;
  const reload = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      this.reload();
      timer = null;
    }, 2000);
  };

  fs.watch(this.options.config, (eventType) => {
    if (eventType === 'change') {
      reload();
    }
  });

  process.on('SIGINT', () => {
    this.stop();
    setTimeout(() => {
      process.kill(0);
    }, 1000);
  });
};

module.exports = NginxExecutor;
