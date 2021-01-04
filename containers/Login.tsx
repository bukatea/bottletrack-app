import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, ScrollView, Keyboard, Platform } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Auth } from 'aws-amplify';
import { AppContextType, useAppContext } from '../libs/context';
import { useNavigation } from '@react-navigation/native';
import { useLoading } from '../hooks/useLoading';
import { onError } from '../libs/error';
import baseStyles from '../baseStyles';
import { validateEmail, validatePassword } from '../libs/validation';

export default function Login() {
  const navigation = useNavigation();
  const { userHasAuthenticated, setEmail: setContextEmail } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, load] = useLoading();

  function validateForm() {
    return validateEmail(email) && validatePassword(password);
  }

  async function handleLogin() {
    try {
      await load(Auth.signIn(email, password));
      setContextEmail(email);
      userHasAuthenticated(true);
      navigation.navigate('Lander');
    } catch (e) {
      onError(e.message);
    }
  }

  return (
    <KeyboardAvoidingView style={baseStyles.View} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.login} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Input
          label="Your Email Address"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          autoCapitalize="none"
          autoCompleteType="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          onSubmitEditing={() => validateForm() && handleLogin()}
          onChangeText={e => setEmail(e)}
        />
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock"}}
          autoCompleteType="password"
          textContentType="password"
          secureTextEntry
          onSubmitEditing={() => validateForm() && handleLogin()}
          onChangeText={e => setPassword(e)}
        />
        <Button 
          title="Login"
          disabled={!validateForm()}
          loading={isLoading}
          onPress={handleLogin}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  login: {
    width: '100%',
    paddingHorizontal: '12.5%',
  },
});