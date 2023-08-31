const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function r(...p) {
  return path.join(__dirname, ...p);
}

execSync('rm -rf ' + r('../pkg'), { stdio: 'inherit' });

fs.mkdirSync(r('../pkg'));

const pkg = require('../package.json');

delete pkg.exports;
delete pkg.devDependencies;
delete pkg.scripts;

pkg.main = 'dist-node/index.js';
pkg.module = 'dist-web/index.js';

fs.writeFileSync(r('../pkg/package.json'), JSON.stringify(pkg, null, 2));

execSync('swc ./src -d pkg/dist-web --config-file ./scripts/web-swc.json', {
  stdio: 'inherit',
});

execSync('swc ./src -d pkg/dist-node --config-file ./scripts/node-swc.json', {
  stdio: 'inherit',
});
