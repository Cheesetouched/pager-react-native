import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { FlashList } from "@shopify/flash-list";

import tw from "@utils/tailwind";
import PageCard from "@components/PageCard";
import useGetPages from "@hooks/queries/useGetPages";

export default function Pages() {
  const { getting, pages } = useGetPages();
  const [selected, setSelected] = useState("received");

  return (
    <BlurView intensity={100} style={tw`flex flex-1 items-center`} tint="dark">
      <DualSelector selected={selected} onSelected={setSelected} />

      {getting || !pages ? (
        <View style={tw`flex-1 justify-center mb-10`}>
          <ActivityIndicator />
        </View>
      ) : pages[selected]?.length > 0 ? (
        <FlashList
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          contentContainerStyle={tw`pt-4 pb-16`}
          data={pages[selected]}
          estimatedItemSize={50}
          renderItem={({ item }) => <PageCard data={item} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={tw`flex-1 justify-center mb-10`}>
          <Text
            style={tw.style(`text-gray-2 text-base text-center`, {
              fontFamily: "Cabin_600SemiBold",
            })}
          >
            no pages found 😕
          </Text>
        </View>
      )}
    </BlurView>
  );
}

function DualSelector({ selected, onSelected }) {
  return (
    <View
      style={tw`bg-black/30 h-[40px] w-[300px] mt-5 rounded-full flex-row overflow-hidden`}
    >
      <TouchableOpacity
        onPress={() => onSelected("received")}
        style={tw.style(
          `flex-1 items-center justify-center rounded-r-full`,
          `${selected === "received" ? "bg-black" : ""}`,
        )}
      >
        <Text
          style={tw.style(
            "text-white text-center",

            {
              fontFamily:
                selected === "received"
                  ? "Cabin_600SemiBold"
                  : "Cabin_400Regular",
            },
          )}
        >
          Received
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelected("sent")}
        style={tw.style(
          `flex-1 items-center justify-center rounded-l-full`,
          `${selected === "sent" ? "bg-black" : ""}`,
        )}
      >
        <Text
          style={tw.style(
            "text-white text-center",

            {
              fontFamily:
                selected === "sent" ? "Cabin_600SemiBold" : "Cabin_400Regular",
            },
          )}
        >
          Sent
        </Text>
      </TouchableOpacity>
    </View>
  );
}
