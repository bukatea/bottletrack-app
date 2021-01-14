import Constants from 'expo-constants';
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  Centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  Overlay: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'visible',
  },
  OverlayDimensions: { // values determined by what looks good in the hacky KeyboardAvoidingOverlay I made
    marginHorizontal: '6.25%',
    marginVertical: '48.875%',
  },
  OverlayText: {
    fontSize: 16,
  },
  OverlayBoldText: {
    fontWeight: 'bold',
  },
});
