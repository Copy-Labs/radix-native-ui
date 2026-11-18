import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { AnimatedPressable } from '../AnimatedPressable';
import { triggerHaptic } from '../../../utils/haptics';

jest.mock('../../../utils/haptics', () => ({
  triggerHaptic: jest.fn(),
}));

describe('AnimatedPressable haptics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPressable = (props: Record<string, unknown> = {}, haptics?: boolean) =>
    render(
      <ThemeProvider haptics={haptics}>
        <AnimatedPressable testID="pressable" {...props} />
      </ThemeProvider>
    );

  it('fires once on press (commit), not on touch-down', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderPressable({ onPress });

    fireEvent(getByTestId('pressable'), 'pressIn');
    expect(triggerHaptic).not.toHaveBeenCalled();

    fireEvent(getByTestId('pressable'), 'press');
    expect(triggerHaptic).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).toHaveBeenCalledWith('press');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire when hapticFeedback is disabled locally', () => {
    const { getByTestId } = renderPressable({ onPress: jest.fn(), hapticFeedback: false });

    fireEvent(getByTestId('pressable'), 'press');

    expect(triggerHaptic).not.toHaveBeenCalled();
  });

  it('does not fire when haptics are disabled globally', () => {
    const { getByTestId } = renderPressable({ onPress: jest.fn() }, false);

    fireEvent(getByTestId('pressable'), 'press');

    expect(triggerHaptic).not.toHaveBeenCalled();
  });
});
