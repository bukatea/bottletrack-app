import React from 'react';
import { StyleProp, ViewStyle, TextStyle, StyleSheet, SafeAreaView, Text } from 'react-native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  CodeFieldProps
} from 'react-native-confirmation-code-field';

interface ConfirmationCodeFieldProps extends Omit<CodeFieldProps, 'renderCell'> {
  cellCount: number,
  value: string,
  onChangeText: (value: string) => void,
  cellStyle?: StyleProp<TextStyle>,
  focusCellStyle?: StyleProp<TextStyle>,
  label?: string,
  labelStyle?: StyleProp<TextStyle>,
}

export default function ConfirmationCodeField(props: ConfirmationCodeFieldProps) {
  const ref = useBlurOnFulfill({
    value: props.value,
    cellCount: props.cellCount,
  });
  const [clearByFocusCellProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: props.value,
    setValue: props.onChangeText,
  });

  return (
    <SafeAreaView>
      <Text style={{ ...styles.label, ...StyleSheet.flatten(props.labelStyle) }}>{props.label}</Text>
      <CodeField
        ref={ref}
        {...props}
        {...clearByFocusCellProps}
        value={props.value}
        onChangeText={props.onChangeText}
        cellCount={props.cellCount}
        rootStyle={props.rootStyle}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[{ ...styles.cell, ...StyleSheet.flatten(props.cellStyle) }, isFocused && { ...styles.focusCell, ...StyleSheet.flatten(props.focusCellStyle) }]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 35,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
});
