import React, { useState, useContext } from 'react';
import { Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import baseStyles from '../baseStyles';
import { AppContextType, useAppContext } from '../libs/context';
import { useLoading } from '../hooks/useLoading';
import { Button, Input, ThemeContext } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { onError } from '../libs/error';
import ConfirmationCodeField from '../components/ConfirmationCodeField';
import { validateEmail, validatePassword } from '../libs/validation';

export default function Signup() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  const [newUser, setNewUser] = useState<ISignUpResult | null>(null);
  const { userHasAuthenticated, setEmail: setContextEmail } = useAppContext();
  const [isLoading, load] = useLoading();

  const CELL_COUNT = 6;

  function validateForm() {
    return (
      validateEmail(email) &&
      validatePassword(password) &&
      password === confirmPassword
    );
  }

  function validateConfirmationForm() {
    return confirmationCode.length === CELL_COUNT;
  }

  async function handleSubmit() {
    try {
      const newUser = await load(
        Auth.signUp({
          username: email,
          password: password,
        }).catch((e: Error) => {
          if (e.name === 'UsernameExistsException') {
            return Auth.resendSignUp(email);
          } else {
            throw e;
          }
        })
      );
      setNewUser(newUser);
    } catch (e) {
      onError(e);
    }
  }

  async function handleConfirmationSubmit() {
    try {
      await load(
        Auth.confirmSignUp(email, confirmationCode).then(() => Auth.signIn(email, password))
      );
      setContextEmail(email);
      userHasAuthenticated(true);
      navigation.navigate('Lander');
    } catch (e) {
      onError(e);
    }
  }

  function renderConfirmationForm() {
    return (
      <>
        <ConfirmationCodeField
          cellCount={CELL_COUNT}
          value={confirmationCode}
          onChangeText={setConfirmationCode}
          cellStyle={{ borderColor: theme.colors?.disabled }}
          label="Confirmation Code"
          labelStyle={{ color: theme.colors?.grey3 }}
          rootStyle={styles.codeField}
        />
        <Button 
          title="Verify"
          disabled={!validateConfirmationForm()}
          loading={isLoading}
          onPress={handleConfirmationSubmit}
        />
      </>
    );
  }

  function renderForm() {
    return (
      <>
        <Input
          label="Email Address"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          autoCapitalize="none"
          autoCompleteType="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          onSubmitEditing={() => validateForm() && handleSubmit()}
          onChangeText={e => setEmail(e)}
        />
        <Input
          label="Password*"
          leftIcon={{ type: "font-awesome", name: "lock"}}
          autoCompleteType="password"
          textContentType="password"
          secureTextEntry
          onSubmitEditing={() => validateForm() && handleSubmit()}
          onChangeText={e => setPassword(e)}
        />
        <Input
          label="Confirm Password*"
          leftIcon={{ type: "font-awesome", name: "lock"}}
          autoCompleteType="password"
          textContentType="password"
          secureTextEntry
          onSubmitEditing={() => validateForm() && handleSubmit()}
          onChangeText={e => setConfirmPassword(e)}
        />
        <Button 
          title="Signup"
          disabled={!validateForm()}
          loading={isLoading}
          onPress={handleSubmit}
        />
        <Text style={[{ color: theme.colors?.grey3 }, styles.passwordMessage]}>
          *Your password must be at least 8 characters long and contain numbers, lowercase letters, uppercase letters, and special characters.
        </Text>
      </>
    );
  }

  return (
    <KeyboardAvoidingView style={baseStyles.View} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.signup} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        {newUser === null ? renderForm() : renderConfirmationForm()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  signup: {
    width: '100%',
    paddingHorizontal: '12.5%',
  },
  passwordMessage: {
    marginTop: 20,
  },
  codeField: {
    marginVertical: 10,
  }
});