import React, { FC } from "react";

import "./index.css";

interface OverlayProps extends React.Props<OverlayProps> {}

const Overlay: FC<OverlayProps> = ({ children }) => {
  return (
    <div className="overlay">
      <div>{children}</div>
    </div>
  );
};

export default Overlay;
