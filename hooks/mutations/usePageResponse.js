import { useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import useCoreAction from "@hooks/useCoreAction";

export default function usePageResponse(props = {}) {
  const { onSuccess } = props;
  const { respondToPage } = useCoreAction();

  const { isLoading, mutate } = useMutation((data) => respondToPage(data), {
    onSuccess,
  });

  return useMemo(
    () => ({
      responding: isLoading,
      respond: mutate,
    }),
    [isLoading, mutate],
  );
}
