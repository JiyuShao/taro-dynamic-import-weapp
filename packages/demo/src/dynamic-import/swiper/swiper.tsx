/*
 * 图片容器组件
 * @Author: Jiyu Shao
 * @Date: 2020-05-11 16:45:24
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2021-01-20 16:07:44
 */
import React from 'react';
import { Swiper, SwiperItem, View, Image } from '@tarojs/components';

import smallImg from './img/small.png';
import largeImg from './img/large.png';

interface IProps {}

function SwiperComponent(_: IProps) {
  return (
    <Swiper
      className="swiper-component"
      indicatorColor="#999"
      indicatorActiveColor="#333"
      vertical
      circular
      indicatorDots
      autoplay
    >
      <SwiperItem>
        <Image src={smallImg} />
        <View className="demo-text-1">1</View>
      </SwiperItem>
      <SwiperItem>
        <Image src={largeImg} />
        <View className="demo-text-2">2</View>
      </SwiperItem>
      <SwiperItem>
        <View className="demo-text-3">3</View>
      </SwiperItem>
    </Swiper>
  );
}
export default SwiperComponent;
