import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AppContextType, useAppContext } from '../libs/context';
import { ThemeContext, Button } from 'react-native-elements';
import { Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';
import baseStyles from '../baseStyles';

export default function Profile() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { userHasAuthenticated, email } = useAppContext();

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    navigation.navigate('Login');
  }

  return (
    <View style={baseStyles.View}>
      <Text>
        Hello, {email}!
      </Text>
      <Button 
        title="Logout"
        buttonStyle={[{ backgroundColor: theme.colors?.error }, styles.button] }
        onPress={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  }
});
