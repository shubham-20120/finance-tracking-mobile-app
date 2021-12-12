import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Home from './components/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateExpense from './components/CreateExpense';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Signin from './components/Signin'
import Signup from './components/Signup'
import { Icon } from 'react-native-elements'
import ExpenseSum from './components/ExpenseSum';


export default function App() {
  const Stack = createNativeStackNavigator();
  // const [token, setToken] = useState(null);
  // const [logoutHelper, setLogoutHelper] = useState(false);
  const [initalRoute, setInitalRoute] = useState("Home");
  const getUser = async () => {
    console.log('calling useEffect-App.js');
    try {
      const tkn = await AsyncStorage.getItem('@userToken');
      // console.log('tkn from app.js', tkn);
      if (tkn == undefined || tkn == null || tkn == "") {
        // await setToken(null);
        // setInitalRoute("Signup")
      } else {
        setInitalRoute("Home")
        // await setToken(tkn);
      }
    } catch (e) {
      alert('something went wrong - home useffect');
    }
  }
  useEffect(() => {
    getUser();
  }, [])


  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName={initalRoute}
      >
        <Stack.Screen
          name="Home"
          component={Home} />
        <Stack.Screen
          name="Signup"
          component={Signup} />
        <Stack.Screen
          name="Signin"
          component={Signin} />
        <Stack.Screen
          name="Create"
          component={CreateExpense} />
        <Stack.Screen
          name="Sum"
          component={ExpenseSum} />
      </Stack.Navigator>
    </NavigationContainer >
  );
}
