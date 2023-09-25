import { StyleSheet } from "react-native";

import { BlurView } from "expo-blur";
import { Tabs } from "expo-router/tabs";
import { Ionicons } from "@expo/vector-icons";

import tw from "@utils/tailwind";

export default function InviteLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: tw`absolute`,
        tabBarActiveTintColor: "#D2FE55",
        tabBarInactiveTintColor: "#A3A3A3",
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={50}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "friends") {
            iconName = focused ? "people-circle" : "people-circle-outline";
          } else if (route.name === "requests") {
            iconName = focused ? "ios-list" : "ios-list-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: tw.style({ fontFamily: "NunitoSans_700Bold" }),
      })}
    >
      <Tabs.Screen name="friends" options={{ href: "/friends" }} />
      <Tabs.Screen name="requests" options={{ href: "/requests" }} />
    </Tabs>
  );
}
