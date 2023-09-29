import * as React from "react";

import Svg, { Rect, Path, Defs, LinearGradient, Stop } from "react-native-svg";

const FacetimeIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={38}
    height={38}
    fill="none"
    {...props}
  >
    <Rect width={37.833} height={37.833} fill="url(#a)" rx={8.424} />
    <Rect
      width={18.473}
      height={16.256}
      x={5.616}
      y={10.789}
      fill="#fff"
      rx={3.695}
    />
    <Path
      fill="#fff"
      d="M24.976 16.545c0-.368.171-.715.464-.939l4.877-3.732c.777-.596 1.9-.041 1.9.939V25.02c0 .98-1.122 1.534-1.9.939l-4.877-3.733a1.182 1.182 0 0 1-.464-.939v-4.743Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={18.917}
        x2={18.917}
        y1={0}
        y2={37.833}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#5CF677" />
        <Stop offset={1} stopColor="#06BC29" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default FacetimeIcon;
