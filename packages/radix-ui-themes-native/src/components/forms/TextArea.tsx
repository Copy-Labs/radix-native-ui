import React from 'react';
import { StyleSheet, TextInput as RNTextInput } from 'react-native';
import { TextField, type TextFieldProps } from './TextField';

interface TextAreaProps extends Omit<TextFieldProps, 'multiline'> {
  /**
   * Number of rows to display
   * @default 4
   */
  rows?: number;
  /**
   * Whether to auto-grow the height based on content
   */
  autoGrow?: boolean;
}

const TextArea = React.forwardRef<React.ComponentRef<typeof RNTextInput>, TextAreaProps>(
  ({ rows = 4, autoGrow = false, style = {}, ...rest }, ref) => {
    return <TextField ref={ref} multiline={true} style={{...styles.textArea, ...style}} {...rest} />;
  }
);

TextArea.displayName = 'TextArea';

const styles = StyleSheet.create({
  textArea: {
    minHeight: 120,
  },
});

export { TextArea };
export type { TextAreaProps };
