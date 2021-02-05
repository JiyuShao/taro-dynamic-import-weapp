# taro-plugin-dynamic-import-weapp

> 基于 Taro 3.0 的小程序端动态加载插件

## 环境

- 建议 node 版本 `12.x`
- `Taro 3.x`

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

在 `src/dynamic-import` 目录下, 编写需要动态加入的代码, 例如:

```js
// src/dynamic-import/button/button.tsx
import React from 'react';
import { Button, View } from '@tarojs/components';

const ButtonComponent = () => {
  return (
    <View>
      <View className="mt-2 px-8 py-8 font-mono">动态加载 ButtonComponent</View>
      <Button className="mx-8 py-2 rounded-xl bg-red-400 text-white text-center">
        <View className="text-lg">ButtonComponent</View>
      </Button>
    </View>
  );
};

export default ButtonComponent;
```

然后在页面中动态引入

```js
// src/pages/index/index.tsx
import React, { Suspense } from 'react';
import { View, Text } from '@tarojs/components';

const Index = () => {
  const DynamicButtonComponent = React.lazy(() =>
    import('../../dynamic-import/button/button')
  );
  return (
    <View className="pb-20 font-mono">
      <View className="flex flex-col items-center p-8 bg-green-100 text-green-500">
        <View className="text-xl">Hello World</View>
      </View>
      <Suspense fallback={<Text>Loading...</Text>}>
        <DynamicButtonComponent />
      </Suspense>
    </View>
  );
};
export default Index;
```

## 运行

项目运行后:

- 打开小程序开发者工具, 可以看到动态请求的 js 代码
- 可以修改 `packages/demo/src/dynamic-import` 中的代码, 对比打包结果

> 注意, 如果没有提供 port 和 publicPath 的情况下, 会使用随机生成的端口, 每次打包都会更改 `runtime.js` 的 `publicPath` 端口, 正式环境指定 `publicPath` 即可

### 示例预览图

**静态页面示例图:**
![静态页面示例图](../../assets/demo-static.jpg)

**动态页面示例图:**
![动态页面示例图](../../assets/demo-dynamic.jpg)

## 缺点

- 不支持 `webpack 5.0+`
- 不支持动态加载样式文件 `wxss`, 建议使用原子性的 CSS 库 `tailwind CSS`

## 基本原理

在 `Taro 3.0` 的 `webpack` 打包能力和 `react` 的运行时能力基础上, 使用 `webpack 插件` 和 `babel 插件` 的情况下, 结合 `dynamic-import`, `wx.request`, `eval5` 来实现打包动态加载的代码的情况下, 不影响静态资源的逻辑
