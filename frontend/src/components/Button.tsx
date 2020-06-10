import React, { FC, MouseEventHandler } from "react";

interface ButtonProps
  extends React.PropsWithoutRef<React.ButtonHTMLAttributes<HTMLButtonElement>> {
  type: "button" | "reset" | "submit";
  onClick?: MouseEventHandler;
  icon?: JSX.Element;
}

const Button: FC<ButtonProps> = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ type = "button", onClick, icon, children }, ref) => {
  return (
    <button type={type} ref={ref} onClick={onClick}>
      {!!icon && <span>{icon}</span>}
      <strong>{children}</strong>
    </button>
  );
});

export default Button;
