import React from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface TextInputProps extends RNTextInputProps {}

export const RnTextInput = React.memo(
  React.forwardRef<React.ElementRef<typeof RNTextInput>, TextInputProps>(
    ({ style, placeholderTextColor, editable = true, ...rest }, ref) => {
      const theme = useTheme();
      const mode = theme.name === 'dark' ? 'dark' : 'light';
      const colors = mode === 'dark' ? theme.colors.gray.dark : theme.colors.gray;

      return (
        <View style={[{
          // backgroundColor: colors[1]
        }]}>
          <RNTextInput
            ref={ref}
            style={[{ color: colors[12] }, style]}
            placeholderTextColor={placeholderTextColor || colors[8]}
            editable={editable}
            {...rest}
          />
        </View>
      );
    }
  )
);

RnTextInput.displayName = 'RnTextInput';

export default RnTextInput;
