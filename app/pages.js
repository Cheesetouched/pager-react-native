import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { BlurView } from "expo-blur";
import { FlashList } from "@shopify/flash-list";

import tw from "@utils/tailwind";
import PageCard from "@components/PageCard";
import useGetDetailedPages from "@hooks/queries/useGetDetailedPages";

export default function Pages() {
  const { pages } = useGetDetailedPages();
  const [selected, setSelected] = useState("received");

  return (
    <BlurView intensity={75} style={tw`flex flex-1`} tint="dark">
      <DualSelector selected={selected} onSelected={setSelected} />

      {!pages ? (
        <View style={tw`flex-1 justify-center mb-10`}>
          <ActivityIndicator />
        </View>
      ) : pages[selected]?.length > 0 ? (
        <View style={tw`flex-1 mt-2`}>
          <FlashList
            ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
            contentContainerStyle={tw`pt-6 px-6`}
            data={pages[selected]}
            estimatedItemSize={50}
            renderItem={({ item }) => <PageCard data={item} type={selected} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={tw`flex-1 justify-center mb-10`}>
          <Text
            style={tw.style(`text-gray-2 text-base text-center`, {
              fontFamily: "Cabin_600SemiBold",
            })}
          >
            no pages (yet) 😕
          </Text>
        </View>
      )}
    </BlurView>
  );
}

function DualSelector({ selected, onSelected }) {
  return (
    <View
      style={tw`bg-black/30 h-[35px] w-[220px] mt-5 rounded-full flex-row overflow-hidden self-center`}
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
