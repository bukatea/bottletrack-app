import React, { useState } from 'react';
import { Overlay, OverlayProps } from 'react-native-elements';
import { PartialBy } from '../libs/typeUtility';

// using Overlay from react-native-elements

export function useSelectItemOverlay<T>() {
  const [current, setCurrent] = useState<T | null>(null);

  return [
    current,
    setCurrent,
    ({ children, isVisible, onBackdropPress, ...props }: PartialBy<OverlayProps, 'isVisible'>) => (
      <Overlay
        isVisible={current !== null && (isVisible != null ? isVisible : true)}
        onBackdropPress={() => {
          setCurrent(null);
          onBackdropPress && onBackdropPress();
        }}
        {...props}
      >
        {children}
      </Overlay>
    )
  ] as const;
}