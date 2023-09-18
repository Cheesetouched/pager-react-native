import * as React from "react";

import Svg, { G, Path } from "react-native-svg";

const BackIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <G strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}>
      <Path stroke="white" d="M15.188 9H2.812" />
      <Path stroke="white" strokeOpacity={0.6} d="M15.188 9H2.812" />
      <Path stroke="white" d="M7.875 3.938 2.812 9l5.063 5.063" />
      <Path
        stroke="white"
        strokeOpacity={0.6}
        d="M7.875 3.938 2.812 9l5.063 5.063"
      />
    </G>
  </Svg>
);
export default BackIcon;
