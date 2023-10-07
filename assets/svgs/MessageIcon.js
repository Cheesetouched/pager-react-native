import * as React from "react";

import Svg, { Path } from "react-native-svg";

const MessageIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={19}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M24.744 2.821c.07.265.106.542.106.829v11.7a3.25 3.25 0 0 1-3.25 3.25H3.4a3.25 3.25 0 0 1-3.25-3.25V3.65A3.25 3.25 0 0 1 3.4.4h18.2c1.02 0 1.928.468 2.524 1.202.287.353.5.767.62 1.219ZM3.4 1.7h18.2c.66 0 1.244.328 1.597.83l-8.398 8.398a3.25 3.25 0 0 1-4.597 0L1.804 2.529c.353-.501.936-.83 1.596-.83ZM1.45 4.014V15.35A1.95 1.95 0 0 0 3.4 17.3h18.2a1.95 1.95 0 0 0 1.95-1.95V4.014l-7.832 7.833a4.55 4.55 0 0 1-6.435 0L1.45 4.014Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default MessageIcon;
