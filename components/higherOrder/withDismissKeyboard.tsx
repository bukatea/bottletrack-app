import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function withDismissKeyboard<T extends {}>(Component: React.ComponentType<React.PropsWithChildren<T>>) {
  return ({ children, ...props }: React.PropsWithChildren<T>) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Component {...props as T}>
        {children}
      </Component>
    </TouchableWithoutFeedback>
  );
}
