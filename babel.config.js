module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-transform-typescript', { allowNamespaces: true }],
      'react-native-reanimated/plugin'
    ],
  };
};
