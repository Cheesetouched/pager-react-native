import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useStorage from "@hooks/useStorage";

export default function useUploadDp(props = {}) {
  const { onSuccess } = props;
  const { uploadDp } = useStorage();

  const { data, isLoading, mutate } = useMutation((uri) => uploadDp(uri), {
    onSuccess,
  });

  return useMemo(
    () => ({
      uploading: isLoading,
      uri: data,
      uploadDp: mutate,
    }),
    [data, isLoading, mutate],
  );
}
