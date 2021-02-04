import React from 'react';
import Taro from '@tarojs/taro';
import { Button, View } from '@tarojs/components';

const ButtonComponent = () => {
  return (
    <View>
      <View className="mt-2 px-8 py-8 font-mono">动态加载 ButtonComponent</View>
      <Button
        className="mx-8 py-2 rounded-xl bg-red-400 text-white text-center"
        onClick={() => {
          Taro.navigateBack();
        }}
      >
        <View className="text-lg">点击返回静态页面</View>
      </Button>
    </View>
  );
};

export default ButtonComponent;
