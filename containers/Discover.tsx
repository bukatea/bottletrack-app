import React, { useContext } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { ThemeProps, ThemeContext, Text } from 'react-native-elements';
import globalStyles from '../globalStyles';

export default function Discover() {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[globalStyles.AndroidSafeArea, globalStyles.Centered]}>
      <Text h1 style={styles.title}>
        BottleTrack
      </Text>
      <Text style={{ color: theme.colors?.grey3 }}>
        No bottle left behind.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
});
