/*
 * 图片容器组件
 * @Author: Jiyu Shao
 * @Date: 2020-05-11 16:45:24
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2021-02-04 16:38:05
 */
import React from 'react';
import { Swiper, SwiperItem, Image, View } from '@tarojs/components';

import smallImg from './img/small.png';
import largeImg from './img/large.png';

interface IProps {}

function SwiperComponent(_: IProps) {
  return (
    <View>
      <View className="mt-2 px-8 py-8 font-mono">动态加载 SwiperComponent</View>
      <Swiper
        className="h-180"
        indicatorColor="#a8a8a8"
        indicatorActiveColor="#0095f6"
        circular
        indicatorDots
        autoplay
      >
        <SwiperItem>
          <Image className="h-full w-full" src={smallImg} mode="aspectFill" />
        </SwiperItem>
        <SwiperItem>
          <Image className="h-full w-full" src={largeImg} mode="aspectFill" />
        </SwiperItem>
      </Swiper>
    </View>
  );
}
export default SwiperComponent;
