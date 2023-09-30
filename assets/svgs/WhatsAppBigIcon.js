import * as React from "react";

import Svg, {
  G,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from "react-native-svg";

const WhatsAppBigIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={57}
    height={57}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Rect width={57} height={57} fill="url(#b)" rx={12.616} />
      <Path
        stroke="#fff"
        strokeWidth={3.8}
        d="m18.778 45.537-.664-.39-.747.183-6.98 1.7 1.796-6.724.209-.782-.42-.693a19.475 19.475 0 1 1 6.806 6.706Z"
      />
      <Path
        fill="#fff"
        d="m24.973 23.48-1.155-3.466a1.834 1.834 0 0 0-1.74-1.254c-.991 0-2.003.28-2.657 1.026-.97 1.106-1.246 2.277-1.246 3.724 0 5.225 9.025 14.725 15.675 15.2 2.548.182 4.716-.72 5.486-3.967.179-.75-.228-1.5-.905-1.869l-2.755-1.502a1.9 1.9 0 0 0-2.352.431l-1.44 1.68a.917.917 0 0 1-1.004.277c-3.082-1.104-4.716-2.848-7.091-6.347a.945.945 0 0 1 .045-1.12l.82-1.026a1.9 1.9 0 0 0 .32-1.788Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={28.5}
        x2={28.5}
        y1={0}
        y2={57}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#00FF68" />
        <Stop offset={1} stopColor="#00D624" />
      </LinearGradient>
      <ClipPath id="a">
        <Rect width={57} height={57} fill="#fff" rx={12.616} />
      </ClipPath>
    </Defs>
  </Svg>
);

export default WhatsAppBigIcon;
