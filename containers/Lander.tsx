import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { Button, ThemeContext, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useAppContext, BluetoothContext } from '../libs/context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import { Ionicons, createIconSetFromIcoMoon } from '@expo/vector-icons';
import Bottles from './Bottles';
import Discover from './Discover';
import Profile from './Profile';
import globalStyles from '../globalStyles';
import { BleManager, Device } from 'react-native-ble-plx';

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
  const [poweredOn, setPoweredOn] = useState(false);
  const manager = new BleManager();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        setPoweredOn(true);
        subscription.remove();
      }
    });
  }, [isAuthenticated]);

  function renderBottomTabNavigator() {
    return fontsLoaded && poweredOn ? (
      <BluetoothContext.Provider value={manager}>
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
      </BluetoothContext.Provider>
    ): null;
  }

  function renderLander() {
    return (
      <SafeAreaView style={[globalStyles.AndroidSafeArea, globalStyles.Centered]}>
        <Text h1 style={styles.title}>
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
      </SafeAreaView>
    );
  }

  return isAuthenticated ? renderBottomTabNavigator() : renderLander();
}

const styles = StyleSheet.create({
  title: {
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
