import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import MenuScreen from "./screens/MenuScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ContactScreen from "./screens/ContactScreen";
import ChatScreen from "./screens/ChatScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import { NavigationContainer } from "@react-navigation/native";
import { theme } from "./core/theme";
import { createStackNavigator } from "@react-navigation/stack";
import { UtilsContext } from './context/UtilsContext';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();
const globalScreenOptions = {
    // headerTransparent: true,
    headerTitleAlign: 'center',
    headerTintColor: `${theme.colors.primary}`, // Set title font color
};

const StackNavigator = ({keyboardShown}) => {

    const { show } = useContext(UtilsContext)

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={globalScreenOptions}>
                <Stack.Screen name="Menu" component={MenuScreen} options={{
                    headerShown: false,
                    headerBackImage: false,
                    headerRight: null,
                    headerLeft: null,
                }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{
                    headerShown: show,
                    headerRight: null,
                    headerLeft: null,
                    title: ""

                }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{
                    headerShown: show,
                    headerRight: null,
                    headerLeft: null,
                    title: ""
                }} />
                <Stack.Screen name="Reset Password" component={ResetPasswordScreen} options={{
                    headerShown: false,
                }} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Contact" component={AddChatScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigator
