import React, { Props, FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";

interface IconTextButtonProps extends Props<IconTextButtonProps> {
  onPress?: (pointerInside: boolean) => void;
  icon?: string;
  text?: string;
}

const IconTextButton: FC<IconTextButtonProps> = ({
  icon,
  text,
  onPress,
  children,
}) => {
  return (
    <RectButton style={styles.button} onPress={onPress}>
      {!!icon && (
        <View style={styles.buttonIcon}>
          <Icon name={icon} color="#fff" size={24} />
        </View>
      )}
      {!!text && <Text style={styles.buttonText}>{text}</Text>}
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

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
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
