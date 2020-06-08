import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../Home";
import SearchPoints from "../../domain/points/SearchPoints";
import PointDetail from "../../domain/points/PointDetail";
import { Routes } from "./routes";

const AppStack = createStackNavigator();

const Router = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: styles.card,
        }}
      >
        <AppStack.Screen name={Routes.HOME} component={Home} />
        <AppStack.Screen name={Routes.SEARCH_POINTS} component={SearchPoints} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0f0f5",
  },
});

export default Router;
