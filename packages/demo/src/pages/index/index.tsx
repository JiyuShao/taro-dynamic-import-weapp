import React, { Suspense } from 'react';
import { View, Text } from '@tarojs/components';

const Index = () => {
  const DynamicComponent = React.lazy(
    () => import('../../dynamic-import/dynamic-component/dynamic-component')
  );
  return (
    <View>
      <Text>Hello World</Text>
      <Suspense fallback={<Text>Loading...</Text>}>
        <DynamicComponent />
      </Suspense>
    </View>
  );
};
export default Index;
