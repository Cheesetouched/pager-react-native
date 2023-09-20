import { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";

import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import tw from "@utils/tailwind";
import Image from "@components/Image";
import { resize } from "@utils/helpers";
import useAppContext from "@hooks/useAppContext";

export default function ImageSelect({ error = false, onSelect, style }) {
  const { alert } = useAppContext();
  const [image, setImage] = useState(null);

  const onError = useCallback(
    (error) => {
      alert.current.show(error);
    },
    [alert],
  );

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.2,
    });

    if (!result.canceled) {
      const resized = await resize(result?.assets[0]);

      if (resized.uri) {
        setImage(resized);
        if (onSelect) onSelect(resized);
      } else {
        onError({
          title: "oops 😕",
          message: "couldn't process this image",
        });
      }
    }
  }, [onError, onSelect]);

  return (
    <TouchableOpacity
      onPress={pickImage}
      style={tw.style(
        `flex bg-text-gray rounded-3xl overflow-hidden justify-center`,
        `${error ? "border-4 border-red-500/75" : "border-2 border-neon"}`,
        `${style ? style : ""}`,
      )}
    >
      {image ? (
        <Image src={image} />
      ) : (
        <Entypo name="camera" size={25} color="white" style={tw`self-center`} />
      )}
    </TouchableOpacity>
  );
}
