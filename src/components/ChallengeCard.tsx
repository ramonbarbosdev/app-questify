import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface ChallengeCardProps {
  challenge: string;
  subtitle?: string;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, subtitle }) => (
  <View style={styles.container}>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    <Text style={styles.challenge}>{challenge}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
    fontWeight: '500',
  },
  challenge: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: 4,
    lineHeight: 48,
  },
});
