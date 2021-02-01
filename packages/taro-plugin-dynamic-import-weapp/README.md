# taro-plugin-dynamic-import-weapp

> 基于 Taro 3.0 的小程序端动态加载插件

## 安装

```bash
# npm 安装
npm install -D taro-plugin-dynamic-import-weapp

# yarn 安装
yarn add -D taro-plugin-dynamic-import-weapp
```

## 使用

在 `config/index.js` 中配置插件, 配置可以省略

```js
{
  // ...
  plugins: [
    [
      "taro-plugin-dynamic-import-weapp",
      {
        // 指定一个子目录为动态加载的目录名称, 方便区分静态代码和动态代码, 默认 "dynamic-import"
        dynamicImportFolderName: "dynamic-import",
        // 开发模式下启动的开发服务器端口, 默认自动分配端口
        port: 5000,
        // 指定动态加载链接 prefix, 默认 "http://127.0.0.1:默认端口/"
        publicPath: "http://localhost:5000/",
      },
    ],
  ],
  // ...
}
```

在 `babel.config.js` 中替换 `babel-preset-taro` 为 `babel-preset-taro-dynamic-import-weapp`, 配置保持不变

```js
{
  // ...
  presets: [
    [
      'babel-preset-taro-dynamic-import-weapp',
      {
        framework: 'react',
        ts: true,
      },
    ],
  ],
  // ...
}
```

正常运行 taro 命令即可, 注意只有在开启 `watch` 的情况下才会跑 dev server
