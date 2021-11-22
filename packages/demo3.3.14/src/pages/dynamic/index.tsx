import React, { Suspense } from 'react';
import { View, Text } from '@tarojs/components';

const Index = () => {
  const DynamicComponent = React.lazy(
    () => import('../../dynamic-import/dynamic-component/dynamic-component')
  );
  return (
    <View className="pb-20 font-mono">
      <View className="flex flex-col items-center p-8 bg-green-100 text-green-500">
        <View className="text-xl">Hello World</View>
        <View className="text-lg">本页面是动态加载页面</View>
      </View>
      <Suspense fallback={<Text>Loading...</Text>}>
        <DynamicComponent />
      </Suspense>
    </View>
  );
};
export default Index;
