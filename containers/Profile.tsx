import React, { useContext } from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';
import { useAppContext, useBluetoothContext } from '../libs/context';
import { ThemeContext, Button } from 'react-native-elements';
import { Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../globalStyles';

export default function Profile() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { userHasAuthenticated, email } = useAppContext();
  const manager = useBluetoothContext();

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    manager.destroy();
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={[globalStyles.AndroidSafeArea, globalStyles.Centered]}>
      <Text>
        Hello, {email}!
      </Text>
      <Button 
        title="Logout"
        buttonStyle={[{ backgroundColor: theme.colors?.error }, styles.button]}
        onPress={handleLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  }
});
