import { Text, TouchableOpacity } from "react-native";

import Checkbox from "expo-checkbox";

import tw from "@utils/tailwind";
import User from "@components/User";

export default function FriendCard({ checked, data, onCheck }) {
  return (
    <TouchableOpacity onPress={onCheck} style={tw`flex-row items-center`}>
      <User
        data={data}
        dimension="45"
        free={data?.freeTill || data?.markedFreeTill}
        title={data?.freeTill || data?.markedFreeTill ? "👋🏻" : "😴"}
        paged={data?.paged}
        showName={false}
        titleContainerStyle="bg-transparent"
      />

      <Text
        style={tw.style(
          `flex-1 text-base ml-3 leading-none`,
          checked() ? "text-white" : "text-text-2",
          {
            fontFamily: "Cabin_700Bold",
          },
        )}
      >
        {data?.name}
      </Text>

      <Checkbox
        color={checked() ? "#43C37C" : undefined}
        onValueChange={onCheck}
        style={tw`border-text-2 rounded-full h-6 w-6`}
        value={checked()}
      />
    </TouchableOpacity>
  );
}
