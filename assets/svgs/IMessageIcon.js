import * as React from "react";

import Svg, { Rect, Path, Defs, LinearGradient, Stop } from "react-native-svg";

const IMessageIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={39}
    height={38}
    fill="none"
    {...props}
  >
    <Rect width={37.833} height={37.833} x={0.195} fill="url(#a)" rx={8.424} />
    <Path
      fill="#fff"
      d="M32.93 18.104c0 6.325-6.187 11.453-13.819 11.453-1.156 0-2.278-.117-3.351-.339-.325-.067-.663-.076-.955.079-.959.507-2.536 1.79-4.59 1.88-.092.005-.144-.101-.087-.175 1.214-1.557 2.005-2.997 1.483-3.277-3.802-2.04-6.318-5.587-6.318-9.621 0-6.326 6.187-11.454 13.818-11.454 7.632 0 13.818 5.128 13.818 11.454Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={19.111}
        x2={19.111}
        y1={0}
        y2={37.833}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#5CF777" />
        <Stop offset={1} stopColor="#0EBC29" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default IMessageIcon;
