import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from "./components/Home";
import SearchMusik from "./components/SearchMusik";
import MusikFavorite from "./components/MusikFavorite";
import Detail from "./components/Detail";
import PlaylistDetail from "./components/PlaylistDetail";
import Icon from "react-native-vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({  color, size }) => {
        let iconName;
        if (route.name === "Home") {
          iconName = "music";
        } else if (route.name === "Search") {
          iconName = "search";
        } else if (route.name === "MusicFav") {
          iconName = "heart";
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#000', // Color of the active icon
      tabBarInactiveTintColor: '#999', // Color of the inactive icons
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Search" component={SearchMusik} />
    <Tab.Screen name="MusicFav" component={MusikFavorite} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Tabs">
          <Stack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Detail" component={Detail} />
          <Stack.Screen name="PlaylistDetail" component={PlaylistDetail} />
          {/* <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
