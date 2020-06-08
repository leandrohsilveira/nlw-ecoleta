import React, { FC, Props } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface IconButtonProps
  extends TouchableOpacityProps,
    Props<IconButtonProps> {
  name: string;
}

const IconButton: FC<IconButtonProps> = (props) => {
  const touchableOpacityProps = { ...props };
  delete touchableOpacityProps.name;

  return (
    <TouchableOpacity {...(touchableOpacityProps as TouchableOpacityProps)}>
      <Icon name={props.name} size={20} color="#34cb79" />
    </TouchableOpacity>
  );
};

export default IconButton;
