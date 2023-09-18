import * as React from "react";

import Svg, { Path } from "react-native-svg";

const CloseIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#A3A3A3"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m12.5 7.5-5 5"
    />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.8}
      d="m12.5 7.5-5 5"
    />
    <Path
      stroke="#A3A3A3"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m7.5 7.5 5 5"
    />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.6}
      d="m7.5 7.5 5 5"
    />
    <Path
      stroke="#A3A3A3"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 17.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
    />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.6}
      d="M10 17.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
    />
  </Svg>
);
export default CloseIcon;
