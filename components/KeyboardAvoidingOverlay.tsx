import React, { PropsWithChildren } from 'react';
import { StyleSheet, StyleProp, ViewStyle, Modal, ModalProps, TouchableWithoutFeedback, View } from 'react-native';
import { MandateProps } from '../libs/typeUtility';
import globalStyles from '../globalStyles';

// partially plagiarized from react-native-elements but they don't have an Overlay that avoids the keyboard so I had to make it myself

export interface KeyboardAvoidingOverlayProps extends MandateProps<PropsWithChildren<ModalProps>, 'visible'> {
  backdropStyle?: StyleProp<ViewStyle>;
  onBackdropPress?: () => void;
}

export function KeyboardAvoidingOverlay(props: KeyboardAvoidingOverlayProps) {
  return (
    <Modal
      onRequestClose={props.onBackdropPress}
      transparent
      {...props}
    >
      <TouchableWithoutFeedback onPress={props.onBackdropPress}>
        <View style={StyleSheet.flatten([styles.backdrop, props.backdropStyle])} />
      </TouchableWithoutFeedback>

      {props.children}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .4)',
  },
});
