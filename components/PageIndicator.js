import React, { memo } from "react";
import { View, ScrollView } from "react-native";

import tw from "@utils/tailwind";

function PageIndicator({ current, total }) {
  return (
    <ScrollView
      alwaysBounceHorizontal={false}
      contentContainerStyle={tw`flex flex-1 justify-center`}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {[...Array(total)].map((_, i) => {
        if (i + 1 === current) {
          return (
            <View
              key={i}
              style={tw`w-8 h-[5px] mr-[6px] rounded-full bg-offwhite/80`}
            />
          );
        }
        return (
          <View
            key={i}
            style={tw`w-8 h-[5px] mr-[6px] rounded-full bg-offwhite/20`}
          />
        );
      })}
    </ScrollView>
  );
}

export default memo(PageIndicator);
