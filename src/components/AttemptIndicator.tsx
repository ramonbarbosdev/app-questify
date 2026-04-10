import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export type AttemptStatus = 'pending' | 'correct' | 'close' | 'wrong';

interface AttemptIndicatorProps {
  attempts: AttemptStatus[];
  maxAttempts: number;
}

const statusColor: Record<AttemptStatus, string> = {
  pending: Colors.gray,
  correct: Colors.accent,
  close: Colors.yellow,
  wrong: Colors.error,
};

export const AttemptIndicator: React.FC<AttemptIndicatorProps> = ({
  attempts,
  maxAttempts,
}) => {
  const dots = Array.from({ length: maxAttempts }, (_, i) => attempts[i] ?? 'pending');

  return (
    <View style={styles.container}>
      {dots.map((status, i) => (
        <View key={i} style={[styles.dot, { backgroundColor: statusColor[status] }]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
});
