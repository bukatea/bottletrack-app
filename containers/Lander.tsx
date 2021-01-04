import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, ThemeContext } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { AppContextType, useAppContext } from '../libs/context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import { Ionicons, createIconSetFromIcoMoon } from '@expo/vector-icons';
import Bottles from './Bottles';
import Discover from './Discover';
import Profile from './Profile';
import baseStyles from '../baseStyles';

const Tab = createBottomTabNavigator();

const SportBottleIcon = createIconSetFromIcoMoon(
  require('../assets/sport-bottle-icon/selection.json'),
  'SportBottle',
  'icomoon.ttf');

export default function Lander() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const { isAuthenticated } = useAppContext();
  const [fontsLoaded] = useFonts({ 'SportBottle': require('../assets/sport-bottle-icon/fonts/icomoon.ttf') });

  function renderBottomTabNavigator() {
    return fontsLoaded && (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Bottles') {
              return focused ?
                <SportBottleIcon name="sport-bottle" size={size} color={color} /> :
                <SportBottleIcon name="sport-bottle-outline" size={size} color={color} />;
            }

            let iconName;
            if (route.name === 'Discover') {
              iconName = focused ? 'bluetooth' : 'bluetooth-outline'
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: theme.colors?.primary,
          inactiveTintColor: theme.colors?.grey3,
        }}
      >
        <Tab.Screen name="Bottles" component={Bottles} />
        <Tab.Screen name="Discover" component={Discover} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    );
  }

  function renderLander() {
    return (
      <View style={baseStyles.View}>
        <Text style={styles.title}>
          BottleTrack
        </Text>
        <Text style={{ color: theme.colors?.grey3 }}>
          No bottle left behind.
        </Text>
        <View style={styles.buttons}>
          <Button
            title="Login"
            buttonStyle={styles.leftButton}
            onPress={() => navigation.navigate('Login')}
          />
          <Button
            title="Signup"
            buttonStyle={[{ backgroundColor: theme.colors?.secondary }, styles.rightButton]}
            onPress={() => navigation.navigate('Signup')}
          />
        </View>
      </View>
    );
  }

  return isAuthenticated ? renderBottomTabNavigator() : renderLander();
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  buttons: {
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  leftButton: {
    marginRight: 5
  },
  rightButton: {
    marginLeft: 5
  },
});
