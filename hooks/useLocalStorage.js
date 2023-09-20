import { useMemo } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useLocalStorage() {
  const clear = async () => {
    return await AsyncStorage.clear();
  };

  const get = async (key) => {
    return await AsyncStorage.getItem(key);
  };

  const getJson = async (key) => {
    const jsonValue = await AsyncStorage.getItem(key);
    return JSON.parse(jsonValue);
  };

  const remove = async (key) => {
    return await AsyncStorage.removeItem(key);
  };

  const save = async (key, value) => {
    return await AsyncStorage.setItem(key, value);
  };

  const saveJson = async (key, value) => {
    const jsonValue = JSON.stringify(value);
    return await AsyncStorage.setItem(key, jsonValue);
  };

  return useMemo(
    () => ({
      clear,
      get,
      getJson,
      remove,
      save,
      saveJson,
    }),
    [],
  );
}
