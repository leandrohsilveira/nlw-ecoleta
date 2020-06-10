import React, { FC } from "react";
import { Link, LinkProps } from "react-router-dom";

interface LinkButtonProps extends React.PropsWithoutRef<LinkProps> {
  to: string;
  icon?: JSX.Element;
}

const LinkButton: FC<LinkButtonProps> = React.forwardRef<
  HTMLAnchorElement,
  LinkButtonProps
>(({ to, icon, children }, ref) => {
  return (
    <Link to={to} ref={ref}>
      {!!icon && <span>{icon}</span>}
      <strong>{children}</strong>
    </Link>
  );
});

export default LinkButton;
