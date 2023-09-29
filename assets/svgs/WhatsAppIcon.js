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

const WhatsAppIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={38}
    height={38}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Rect
        width={37.833}
        height={37.833}
        x={0.167}
        fill="url(#b)"
        rx={8.374}
      />
      <Path
        stroke="#fff"
        strokeWidth={2.522}
        d="m12.63 30.225-.44-.259-.496.121-4.633 1.13 1.192-4.464.138-.52-.278-.46a12.927 12.927 0 1 1 4.517 4.452Z"
      />
      <Path
        fill="#fff"
        d="m16.742 15.584-.766-2.3a1.217 1.217 0 0 0-1.155-.832c-.659 0-1.33.186-1.764.681-.644.734-.827 1.511-.827 2.472 0 3.468 5.99 9.773 10.404 10.088 1.691.121 3.13-.478 3.642-2.633.118-.498-.152-.995-.601-1.24l-1.829-.997a1.261 1.261 0 0 0-1.561.286l-.956 1.116a.609.609 0 0 1-.666.183c-2.046-.733-3.13-1.89-4.707-4.213a.627.627 0 0 1 .03-.744l.545-.68c.267-.334.347-.78.211-1.187Z"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={19.083}
        x2={19.083}
        y1={0}
        y2={37.833}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#00FF68" />
        <Stop offset={1} stopColor="#00D624" />
      </LinearGradient>
      <ClipPath id="a">
        <Rect width={37.833} height={37.833} x={0.167} fill="#fff" rx={8.374} />
      </ClipPath>
    </Defs>
  </Svg>
);

export default WhatsAppIcon;
