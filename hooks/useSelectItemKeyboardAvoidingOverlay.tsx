import React, { useState, useCallback } from 'react';
import { KeyboardAvoidingOverlay, KeyboardAvoidingOverlayProps } from '../components/KeyboardAvoidingOverlay';
import { PartialBy } from '../libs/typeUtility';

export function useSelectItemKeyboardAvoidingOverlay<T>() {
  const [current, setCurrent] = useState<T | null>(null);

  return [
    current,
    setCurrent,
    useCallback(({ children, visible, onBackdropPress, ...props }: PartialBy<KeyboardAvoidingOverlayProps, 'visible'>) => (
      <KeyboardAvoidingOverlay
        visible={current !== null && (visible != null ? visible : true)}
        onBackdropPress={() => {
          setCurrent(null);
          onBackdropPress && onBackdropPress();
        }}
        {...props}
      >
        {children}
      </KeyboardAvoidingOverlay>
    ), [current])
  ] as const;
}