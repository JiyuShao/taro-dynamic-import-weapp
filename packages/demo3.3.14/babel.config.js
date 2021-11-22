// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      'babel-preset-taro-dynamic-import-weapp',
      {
        framework: 'react',
        ts: true,
      },
    ],
  ],
};
