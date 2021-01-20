import React, { Suspense } from 'react';
import { View, Text } from '@tarojs/components';

const Index = () => {
  const AsyncButton = React.lazy(
    () => import('../../async-components/button/button')
  );
  const AsyncSwiper = React.lazy(
    () => import('../../async-components/swiper/swiper')
  );
  return (
    <View>
      <Text>Hello World</Text>
      <Suspense fallback={<Text>Loading...</Text>}>
        <AsyncButton />
        <AsyncSwiper />
      </Suspense>
    </View>
  );
};
export default Index;
