import * as React from "react";

import Svg, { Rect, Path, Defs, LinearGradient, Stop } from "react-native-svg";

const IMessageBigIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={58}
    height={57}
    fill="none"
    {...props}
  >
    <Rect width={57} height={57} x={0.626} fill="url(#a)" rx={12.691} />
    <Path
      fill="#fff"
      d="M49.944 27.275c0 9.53-9.32 17.256-20.818 17.256-1.742 0-3.433-.177-5.05-.51-.488-.102-.998-.115-1.439.118-1.443.764-3.82 2.697-6.914 2.834-.14.006-.218-.154-.132-.265 1.829-2.347 3.02-4.516 2.235-4.937-5.728-3.075-9.519-8.418-9.519-14.496 0-9.53 9.321-17.255 20.819-17.255 11.497 0 20.818 7.725 20.818 17.255Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={29.126}
        x2={29.126}
        y1={0}
        y2={57}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#5CF777" />
        <Stop offset={1} stopColor="#0EBC29" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default IMessageBigIcon;
