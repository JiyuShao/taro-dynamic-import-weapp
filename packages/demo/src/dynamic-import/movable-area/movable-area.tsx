import React from 'react';
import { View, Text, MovableArea, MovableView } from '@tarojs/components';

const MoveableAreaComponent = () => {
  return (
    <View>
      <View className="mt-2 px-8 py-8 font-mono">
        动态加载 MoveableAreaComponent
      </View>
      <MovableArea className="w-screen h-180 bg-green-100">
        <MovableView
          direction="all"
          className="flex items-center justify-center w-56 h-56 rounded-full bg-red-500"
        >
          <Text>DRAG</Text>
        </MovableView>
      </MovableArea>
    </View>
  );
};

export default MoveableAreaComponent;
