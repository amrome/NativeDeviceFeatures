import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";

import AllPlaces from "./screens/AllPlaces";
import AddPlace from "./screens/AddPlace";
import IconButton from "./components/UI/IconButton";
import { Colors } from "./constants/colors";
import Map from "./screens/Map";
import { init } from "./util/database";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op: this can throw if called multiple times during fast refresh
});

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function prepare() {
      try {
        await init();
      } catch (err) {
        console.log("Database initialization failed.", err);
      } finally {
        if (isMounted) {
          setDbInitialized(true);
        }
        await SplashScreen.hideAsync();
      }
    }

    prepare();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!dbInitialized) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary500 },
            headerTintColor: Colors.gray700,
            contentStyle: { backgroundColor: Colors.gray700 },
          }}
        >
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={({ navigation }) => ({
              title: "Your Favorite Places",
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon="add"
                  size={24}
                  color={tintColor}
                  onPress={() => {
                    navigation.push("AddPlace");
                  }}
                />
              ),
            })}
          />
          <Stack.Screen
            name="AddPlace"
            component={AddPlace}
            options={{
              title: "Add a new Place",
            }}
          />
          <Stack.Screen
            name="Map"
            component={Map}
            options={{
              title: "Select on Map",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
