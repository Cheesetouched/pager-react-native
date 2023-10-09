import { Platform } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import * as Device from "expo-device";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

import useAppContext from "@hooks/useAppContext";

export default function useNotifications(props = {}) {
  // Make sure these prop functions are wrapped in a useCallback
  // function, inside the hook consumer, to prevent unnecessary
  // re-rendering
  const previousState = useRef();
  const { appState } = useAppContext();
  const { onDenied, onGranted } = props;
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState();

  const requestNotifications = useCallback(() => {
    setLoading(true);

    getPushToken().then(async (pushToken) => {
      setLoading(false);

      if (pushToken) {
        return onGranted(pushToken);
      } else {
        if (onDenied) {
          onDenied();
        }
      }

      Notifications.getPermissionsAsync().then((data) => {
        setPermission(data);
      });
    });
  }, [onDenied, onGranted]);

  useEffect(() => {
    Notifications.getPermissionsAsync().then((permission) => {
      setPermission(permission);

      if (permission.granted) {
        requestNotifications();
      }
    });
  }, [requestNotifications]);

  useEffect(() => {
    if (previousState.current === "background" && appState === "active") {
      requestNotifications();
    }

    previousState.current = appState;
  }, [appState, requestNotifications]);

  return useMemo(
    () => ({
      permission,
      loading,
      requestNotifications,
    }),
    [loading, permission, requestNotifications],
  );
}

async function getPushToken() {
  let token = null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;
  } else {
    token = "simulator";
  }

  return token;
}
