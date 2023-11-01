import { Text, TouchableOpacity } from "react-native";

import Checkbox from "expo-checkbox";

import tw from "@utils/tailwind";
import User from "@components/User";
import { isValid } from "@utils/helpers";

export default function FriendCard({ checked, data, onCheck }) {
  const free = isValid(data?.freeTill || data?.markedFreeTill);

  return (
    <TouchableOpacity onPress={onCheck} style={tw`flex-row items-center`}>
      <User
        data={data}
        dimension="45"
        free={free}
        paged={data?.paged}
        showName={false}
        showMetadata={false}
        title={free ? "👋🏻" : "😴"}
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
