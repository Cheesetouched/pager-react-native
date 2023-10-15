import { forwardRef, memo, useImperativeHandle, useState } from "react";
import { View } from "react-native";

import Carousel from "react-native-reanimated-carousel";

import tw from "@utils/tailwind";
import PageIndicator from "@components/PageIndicator";

/*
This is a strictly pure component. Wrap all prop functions with useCallback() or else,
any state change in the parent component will cause an infinite render loop.
*/

const CarouselView = forwardRef(
  ({ data, loop = true, renderItem, width }, ref) => {
    const [position, setPosition] = useState(1);

    useImperativeHandle(ref, () => ({
      position,
    }));

    return (
      <View style={tw`flex flex-1`}>
        <View style={tw`flex ${data?.length > 1 ? "h-[95%]" : "h-[100%]"}`}>
          <Carousel
            data={data}
            loop={loop}
            onSnapToItem={(index) => setPosition(index + 1)}
            renderItem={renderItem}
            width={width}
          />
        </View>

        {data?.length > 1 ? (
          <View style={tw`flex flex-row h-[5%] items-end justify-center`}>
            <PageIndicator current={position} total={data.length} />
          </View>
        ) : null}
      </View>
    );
  },
);

export default memo(CarouselView);
