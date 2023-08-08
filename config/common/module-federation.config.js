const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const dependencies = require(path.resolve('package.json')).dependencies;

function getShared () {
  const shared = {};
  for (const key in dependencies) {
    shared[key] = {
      eager: true,
      singleton: true,
      requiredVersion: dependencies[key],
    };
  }
  return shared;
}

function getModuleFederationPlugin () {
  return new ModuleFederationPlugin({
    name: process.env.APP_NAME,
    filename: 'remoteEntry.js',
    exposes: process.env.APP_EXPOSES
      ? JSON.parse(process.env.APP_EXPOSES ?? '')
      : {
        './Module': './src/components/App',
      },
    shared: getShared(),
  });
}

module.exports = {
  getModuleFederationPlugin,
};
