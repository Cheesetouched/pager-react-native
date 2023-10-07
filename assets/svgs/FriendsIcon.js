import * as React from "react";

import Svg, { Path } from "react-native-svg";

const FriendsIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={19}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M3.496 5.499a5.5 5.5 0 1 1 8.596 4.547 9.005 9.005 0 0 1 5.9 8.18.751.751 0 0 1-1.5.045 7.5 7.5 0 0 0-14.993 0A.75.75 0 0 1 0 18.227a9.005 9.005 0 0 1 5.9-8.181 5.496 5.496 0 0 1-2.404-4.547Zm5.5-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8.29 4c-.148 0-.292.01-.434.03a.75.75 0 1 1-.212-1.484 4.53 4.53 0 0 1 3.38 8.097 6.69 6.69 0 0 1 3.956 6.107.75.75 0 0 1-1.5 0 5.193 5.193 0 0 0-3.696-4.972l-.534-.16V11.44l.41-.21a3.03 3.03 0 0 0-1.37-5.732Z"
    />
  </Svg>
);
export default FriendsIcon;
