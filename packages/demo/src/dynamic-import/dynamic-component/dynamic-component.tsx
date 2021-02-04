import React from 'react';
import { View } from '@tarojs/components';

const AsyncButton = React.lazy(
  () => import('../../dynamic-import/button/button')
);
const AsyncSwiper = React.lazy(
  () => import('../../dynamic-import/swiper/swiper')
);
const AsyncMovableArea = React.lazy(
  () => import('../../dynamic-import/movable-area/movable-area')
);

const DynamicComponent = () => {
  return (
    <View>
      <AsyncButton />
      <AsyncSwiper />
      <AsyncMovableArea />
    </View>
  );
};

export default DynamicComponent;
