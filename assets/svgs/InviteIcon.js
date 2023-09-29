import * as React from "react";
import Svg, { Path } from "react-native-svg";

const InviteIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    {...props}
  >
    <Path
      fill="#797979"
      d="M11 14.543a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
    <Path
      fill="#797979"
      d="M.5 11.543c0 1 1 1 1 1h5.256a4.493 4.493 0 0 1-.256-1.5A4.49 4.49 0 0 1 8.044 7.65c-.467-.069-.98-.107-1.544-.107-5 0-6 3-6 4Z"
    />
  </Svg>
);
export default InviteIcon;
