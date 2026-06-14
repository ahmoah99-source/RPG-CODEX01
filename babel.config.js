module.exports = function (api) {
  api.cache(true);
  
  // حقن مسار النود الإجباري لو البناء شغال على سيرفر جيت هب
  if (process.env.CI) {
    process.env.NODE_BINARY = '/usr/local/bin/node';
  }

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // لازم إضافة ريأنيميتد تكون في آخر القائمة دايماً
      'react-native-reanimated/plugin',
    ],
  };
};
