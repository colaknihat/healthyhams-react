import React, {useState, useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './components/Login.js';
import Ask from './components/Ask.js';
import HomeScreen from './components/Homescreen.js';
import Details from './components/Details.js';
import PersonalSettings from './components/PersonalSettings.js';
import Calendar from './components/Calendar.js';
import Overview from './components/Overview.js';
import MealHistory from './components/MealHistory.js';

const Stack = createNativeStackNavigator();

function App() {

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
        }}>
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Ask" component={Ask} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen
              name="PersonalSettings"
              component={PersonalSettings}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'white',
                },
                headerTintColor: '#23233C',
                headerTitle: 'Profile Settings',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 20,
                },
              }}
            />
            <Stack.Screen
              name="Calendar"
              component={Calendar}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Overview"
              component={Overview}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="MealHistory"
              component={MealHistory}
              options={{
                headerShown: false,
              }}
            />
          </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
