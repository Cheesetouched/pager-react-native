import * as React from "react";

import Svg, { Rect, Path, Defs, LinearGradient, Stop } from "react-native-svg";

const PhoneIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={38}
    height={38}
    fill="none"
    {...props}
  >
    <Rect width={37.833} height={37.833} x={0.139} fill="url(#a)" rx={8.424} />
    <Path
      fill="#FEFEFE"
      d="M7.33 13.227c-1.56-4.199 1.13-6.061 3.075-6.602.33-.092.671.057.867.337l3.538 5.077c.23.33.205.77-.032 1.095-.81 1.107-1.101 2.046-1.206 2.777-.087.605.129 1.206.492 1.698 2.782 3.765 5.792 6.596 7.27 6.665 1.082.05 2.404-.789 3.125-1.318a.96.96 0 0 1 1.095-.043l5.179 3.452c.284.19.439.53.366.863-.945 4.347-5.032 3.885-7.032 3.068-9.384-4.36-14.594-11.305-16.737-17.07Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={19.056}
        x2={19.056}
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
export default PhoneIcon;
