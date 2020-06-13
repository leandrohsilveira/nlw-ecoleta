import React, { Props, FC, PropsWithChildren } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";

interface IconTextButtonProps {
  onPress?: (pointerInside: boolean) => void;
  icon?: string | JSX.Element;
  text?: string;
  style?: StyleProp<ViewStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  enabled?: boolean;
}

const IconTextButton: FC<PropsWithChildren<IconTextButtonProps>> = ({
  icon,
  text,
  style,
  iconContainerStyle,
  textStyle,
  onPress,
  children,
  enabled = true,
}) => {
  return (
    <RectButton
      enabled={enabled}
      style={style ?? [styles.button, !enabled ? styles.buttonDisabled : {}]}
      onPress={onPress}
    >
      {!!icon && (
        <View style={iconContainerStyle ?? styles.buttonIcon}>
          {typeof icon === "string" ? (
            <Icon name={icon} color="#fff" size={24} />
          ) : (
            icon
          )}
        </View>
      )}
      {!!text && <Text style={textStyle ?? styles.buttonText}>{text}</Text>}
      {children}
    </RectButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.3,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000011",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default IconTextButton;
