import { AttemptStatus } from '@/src/components/AttemptIndicator';
import { CellStatus, ResultGrid } from '@/src/components/ResultGrid';
import { Colors } from '@/src/theme/colors';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Share,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface ResultScreenProps {
  attempts: AttemptStatus[];
  guesses: string[];
  onPlayAgain?: () => void;
}

const statusToEmoji: Record<AttemptStatus, string> = {
  correct: '🟩',
  close: '🟨',
  wrong: '⬛',
  pending: '⬜',
};

export const ResultScreen: React.FC<ResultScreenProps> = ({
  attempts,
  guesses,
  onPlayAgain,
}) => {
  const won = attempts.includes('correct');
  const scale = React.useRef(new Animated.Value(1)).current;

  const gridRows: CellStatus[][] = attempts.map((a) => [a === 'pending' ? 'wrong' : a]);
  const gridGuesses = guesses.map((g) => [g]);

  const handleShare = async () => {
    const emoji = attempts.map((a) => statusToEmoji[a]).join('');
    const text = `Daily Challenge ${new Date().toLocaleDateString()}\n${emoji}\n${
      won ? `Solved in ${attempts.indexOf('correct') + 1}/${attempts.length}` : 'Better luck tomorrow!'
    }`;
    try {
      await Share.share({ message: text });
    } catch {}
  };

  const animatePress = (onPress: () => void) => ({
    onPressIn: () =>
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start(),
    onPressOut: () =>
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start(),
    onPress,
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.emoji]}>{won ? '🎉' : '😔'}</Text>
          <Text style={[styles.title, won ? styles.titleWon : styles.titleLost]}>
            {won ? 'Brilhante!' : 'Não desta vez'}
          </Text>
          <Text style={styles.subtitle}>
            {won
              ? `Resolvido em ${attempts.indexOf('correct') + 1} tentativa${attempts.indexOf('correct') > 0 ? 's' : ''}`
              : 'Volte amanhã para um novo desafio.'}
          </Text>
        </View>

        <ResultGrid rows={gridRows} guesses={gridGuesses} />

        <View style={styles.actions}>
          <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
            <Pressable style={styles.shareButton} {...animatePress(handleShare)}>
              <Text style={styles.shareText}>Compartilhar resultado</Text>
            </Pressable>
          </Animated.View>

          {onPlayAgain && (
            <Pressable style={styles.secondaryButton} onPress={onPlayAgain}>
              <Text style={styles.secondaryText}>Jogue novamente</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  titleWon: {
    color: Colors.button,
  },
  titleLost: {
    color: Colors.error,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.secondary,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 12,
    paddingTop: 16,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: Colors.button,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareText: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryText: {
    color: Colors.secondary,
    fontSize: 15,
    fontWeight: '500',
  },
});
