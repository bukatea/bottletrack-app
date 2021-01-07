import Constants from 'expo-constants';
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  Centered: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
