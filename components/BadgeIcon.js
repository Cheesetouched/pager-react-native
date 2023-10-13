import { Text, View } from "react-native";

import tw from "@utils/tailwind";

export default function BadgeIcon({ children, count }) {
  return (
    <View>
      {children}

      {count > 0 ? (
        <View
          style={tw`absolute h-5 w-5 bg-red-500 rounded-full items-center justify-center top-[-3] right-[-3]`}
        >
          <Text style={tw.style(`text-white font-bold`)}>{count}</Text>
        </View>
      ) : null}
    </View>
  );
}
