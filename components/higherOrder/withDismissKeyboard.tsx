import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function withDismissKeyboard(Component: React.ComponentType) {
  return ({ children, ...props }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Component {...props}>
        {children}
      </Component>
    </TouchableWithoutFeedback>
  );
}
