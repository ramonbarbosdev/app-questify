import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useJogoStore } from '@/src/store/jogoStore';
import { Colors } from '@/src/theme/colors';
import { ResultGrid } from '@/src/components/ResultGrid';
import { StatusJogo } from '@/src/types/StatusJogo';

// 🔥 emoji só para estados finais
const statusToEmoji: Record<StatusJogo, string> = {
  correto: '🟩',
  fechado: '🟨',
  errado: '⬛',
  perto: '⬛',
  pendente: '⬛',
};

export default function Result() {
  const router = useRouter();
  const { tentativas, respostas, resetar } = useJogoStore();

  const tentativasValidas: StatusJogo[] = tentativas.filter(
    (t): t is StatusJogo => t !== 'pendente'
  );


  const idxCorreto = tentativasValidas.indexOf('correto');
  const ganhou = idxCorreto !== -1;

  const scale = React.useRef(new Animated.Value(1)).current;

  const gridRows = tentativasValidas.map((t) => [t]);
  const gridGuesses = respostas
    .slice(0, tentativasValidas.length)
    .map((r) => [r]);

  const handleShare = async () => {
    const emoji = tentativasValidas.map((t) => statusToEmoji[t]).join('');

    const texto = `Nivra • ${new Date().toLocaleDateString()}\n${emoji}\n${
      ganhou
        ? `Resolvido em ${idxCorreto + 1}/${tentativasValidas.length}`
        : 'Não foi dessa vez 😔'
    }`;

    try {
      await Share.share({ message: texto });
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
          <Text style={styles.emoji}>
            {ganhou ? '🎉' : '😔'}
          </Text>

          <Text style={[
            styles.title,
            ganhou ? styles.titleWon : styles.titleLost
          ]}>
            {ganhou ? 'Brilhante!' : 'Não desta vez'}
          </Text>

          <Text style={styles.subtitle}>
            {ganhou
              ? `Resolvido em ${idxCorreto + 1} tentativa${idxCorreto > 0 ? 's' : ''}`
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

          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              resetar();
              router.replace('/menu');
            }}
          >
            <Text style={styles.secondaryText}>Jogar novamente</Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

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
    gap: 12,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
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
    marginTop: 16,
  },
  shareButton: {
    backgroundColor: Colors.button,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  secondaryText: {
    color: Colors.secondary,
    fontSize: 14,
  },
});