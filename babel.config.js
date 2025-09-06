module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/screens': './src/screens',
            '@/components': './src/components',
            '@/theme': './src/theme',
            '@/hooks': './src/hooks',
            '@/utils': './src/utils',
          },
        },
      ],
      // 'react-native-reanimated/plugin' must be listed last
      'react-native-reanimated/plugin',
    ],
  };
};
