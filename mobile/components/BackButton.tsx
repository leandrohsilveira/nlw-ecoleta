import React, { useCallback } from "react";
import { View, Text } from "react-native";
import IconButton from "./IconButton";
import { useNavigation } from "@react-navigation/native";

const BackButton = () => {
  const navigation = useNavigation();

  const handlePressed = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, []);

  return <IconButton name="arrow-left" onPress={handlePressed} />;
};

export default BackButton;
