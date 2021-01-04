import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ThemeProps, ThemeContext } from 'react-native-elements';
import baseStyles from '../baseStyles';

export default function Home() {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={baseStyles.View}>
      <Text style={styles.title}>
        BottleTrack
      </Text>
      <Text style={{ color: theme.colors?.grey3 }}>
        No bottle left behind.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});
