import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Auth/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import MediaPickerScreen from '../screens/Home/MediaPickerScreen';
import VideoEditorScreen from '../screens/Video/VideoEditorScreen';
import PhotoEditorScreen from '../screens/Photo/PhotoEditorScreen';
import CollageEditorScreen from '../screens/Collage/CollageEditorScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import AccountScreen from '../screens/Settings/AccountScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MediaPicker" component={MediaPickerScreen as any} />
        <Stack.Screen name="VideoEditor" component={VideoEditorScreen} />
        {/* <Stack.Screen name="PhotoEditor" component={PhotoEditorScreen} /> */}
        {/* <Stack.Screen name="VideoEditor" component={VideoEditorScreen} /> */}
        <Stack.Screen name="PhotoEditor" component={PhotoEditorScreen as any} />
        <Stack.Screen name="CollageEditor" component={CollageEditorScreen as any} />
        {/* <Stack.Screen name="CollageEditor" component={CollageEditorScreen as any} /> */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}