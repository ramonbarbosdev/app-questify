import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  Pressable,
  Text,
} from 'react-native';
import { Colors } from '../theme/colors';

interface AnswerInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  disabled,
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Your answer"
        placeholderTextColor={Colors.tertiary}
        keyboardType="default"
        autoCorrect={false}
        editable={!disabled}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={onSubmit}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled || !value.trim()}
          style={[
            styles.button,
            (!value.trim() || disabled) && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>Check</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    gap: 16,
    width: '100%',
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 2,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
