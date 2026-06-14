const { getDefaultConfig } = require('expo/metro-config');

if (process.env.CI) {
  process.env.NODE_BINARY = '/usr/local/bin/node';
}

const config = getDefaultConfig(__dirname);

module.exports = config;

