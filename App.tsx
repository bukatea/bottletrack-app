import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import Lander from './containers/Lander';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Bottle from './containers/Bottle';
import { Auth, Amplify } from 'aws-amplify';
import config from './config';
import { Platform } from 'react-native';
import { Button, colors, ThemeProvider } from 'react-native-elements';
import { AppContext } from './libs/context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onError } from './libs/error';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { RootStackParamList } from './libs/types';

const Stack = createStackNavigator<RootStackParamList>();

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: "bottles",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  }
});

export default function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        user.getUserAttributes((err: Error, result: CognitoUserAttribute[]) => {
          if (err) {
            throw err;
          }
          setEmail(result.filter((item: CognitoUserAttribute) => item.getName() === 'email')[0].getValue());
        });
        userHasAuthenticated(true);
      } catch (e) {
        if (e !== 'The user is not authenticated') {
          onError(e);
        }
      }

      setIsAuthenticating(false);
    })();
  }, []);

  return (
    !isAuthenticating && (
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated, email, setEmail }}>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Lander" screenOptions={{ headerBackTitleVisible: false, }}>
              <Stack.Screen name="Lander" component={Lander} options={{ headerShown: false, }} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Bottle" component={Bottle} options={({ route }) => ({ title: route.params.bottleName })} />
            </Stack.Navigator>
          </NavigationContainer>
         <StatusBar />
        </ThemeProvider>
      </AppContext.Provider>
    )
  );
}

const theme = {
  colors: {
    ...Platform.select({
      default: colors.platform.android,
      ios: colors.platform.ios,
    }),
  }
};
