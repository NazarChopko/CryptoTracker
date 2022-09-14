import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CoinDetail from "../screens/CoinDetailsScreen";
import BottomTabNavigation from "./BottomTabNavigation";
import AddNewAssetsScreen from "../screens/AddNewAssetsScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName="Root">
      <Stack.Screen
        name="Root"
        component={BottomTabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CoinDetail"
        component={CoinDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddNewAssetsScreen"
        component={AddNewAssetsScreen}
        options={{
          titel: "Add New Asset",
          headerStyle: {
            backgroundColor: "#121212",
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
