import React, { Suspense } from 'react';
import { View, Text } from '@tarojs/components';
import config from '../../utils/config';

const Index = () => {
  const DynamicComponent = React.lazy(
    () => import('../../dynamic-import/dynamic-component/dynamic-component')
  );
  return (
    <View>
      <Text>Hello World{config.configId}</Text>
      <Suspense fallback={<Text>Loading...</Text>}>
        <DynamicComponent />
      </Suspense>
    </View>
  );
};
export default Index;
