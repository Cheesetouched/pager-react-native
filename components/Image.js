import { memo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { Image } from "expo-image";

import tw from "@utils/tailwind";

const NetworkImage = ({ src, style }) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={tw`relative flex flex-1 justify-center`}>
      <Image
        onLoadEnd={() => setLoading(false)}
        source={src}
        style={tw.style(`flex flex-1`, `${style ? style : ""}`)}
      />

      {loading ? <ActivityIndicator style={tw`absolute self-center`} /> : null}
    </View>
  );
};

export default memo(NetworkImage);
