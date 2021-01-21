import React from 'react';
import { View } from '@tarojs/components';

const AsyncButton = React.lazy(
  () => import('../../dynamic-import/button/button')
);
const AsyncSwiper = React.lazy(
  () => import('../../dynamic-import/swiper/swiper')
);

const DynamicComponent = () => {
  return (
    <View>
      <AsyncButton />
      <View>大幅度是</View>
      <AsyncSwiper />
    </View>
  );
};

export default DynamicComponent;
