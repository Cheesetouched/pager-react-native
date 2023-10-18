import * as React from "react";

import Svg, { Path } from "react-native-svg";

const MessageIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14 20c-.4.598-1.145 1-2 1s-1.6-.402-2-1"
    />
    <Path
      stroke="#fff"
      strokeWidth={1.5}
      d="M16.994 9.317v-.794c0-.894-.147-1.78-.434-2.624-.502-1.473-1.753-2.544-3.258-2.79l-.05-.008a7.775 7.775 0 0 0-2.504 0l-.05.009c-1.505.245-2.756 1.316-3.258 2.789a8.14 8.14 0 0 0-.434 2.624v.794c0 .48-.187.938-.52 1.275l-.577.583c-1.7 1.72-.896 4.681 1.428 5.256 3.064.759 6.262.759 9.326 0 2.324-.575 3.129-3.536 1.428-5.256l-.577-.583a1.813 1.813 0 0 1-.52-1.275Z"
    />
  </Svg>
);
export default MessageIcon;
