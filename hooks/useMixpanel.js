import { useMemo } from "react";

import useAppContext from "@hooks/useAppContext";

export default function useMixpanel() {
  const { mixpanel } = useAppContext();

  return useMemo(() => mixpanel, [mixpanel]);
}
