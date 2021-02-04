import React from 'react';
import Taro from '@tarojs/taro';
import { Button, View } from '@tarojs/components';

const Index = () => {
  return (
    <View className="pb-20 font-mono">
      <View className="flex flex-col items-center mt-80 p-8 bg-red-100 text-red-500">
        <View className="text-xl">Hello World</View>
        <View className="text-lg">本页面是静态页面</View>
      </View>
      <Button
        className="mt-12 m-8 py-2 rounded-xl bg-green-400 text-white text-center"
        onClick={() => {
          Taro.navigateTo({
            url: '/pages/dynamic/index',
          });
        }}
      >
        <View className="text-lg">点击跳转动态页面</View>
      </Button>
    </View>
  );
};
export default Index;
