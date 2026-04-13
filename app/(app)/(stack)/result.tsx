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

const statusToEmoji: Record<StatusJogo, string> = {
  correto: '🟩',
  perto: '🟨',
  errado: '⬛',
  fechado: '⬛',
  pendente: '⬛',
  alto: '⬛',
  baixo: '⬛',
};

function getMensagem(ganhou: boolean, tentativas: number) {
  if (!ganhou) return 'Quase lá. Você chega na próxima!';

  if (tentativas === 1) return 'Genial. Primeira tentativa.';
  if (tentativas <= 3) return 'Mandou muito bem!';
  if (tentativas <= 5) return 'Boa! Você conseguiu.';

  return 'Conseguiu!';
}

export default function Result() {
  const router = useRouter();
  const { tentativas, respostas, resetar } = useJogoStore();

  const tentativasValidas = tentativas.filter(
    (t): t is StatusJogo => t !== 'pendente'
  );

  const idxCorreto = tentativasValidas.indexOf('correto');
  const ganhou = idxCorreto !== -1;

  const total = Math.min(
    tentativasValidas.length,
    respostas.length
  );

  const gridRows = tentativasValidas
    .slice(0, total)
    .map((t) => [t]);

  const gridGuesses = respostas
    .slice(0, total)
    .map((r) => [r]);

  const scale = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleShare = async () => {
    const emoji = tentativasValidas
      .slice(0, total)
      .map((t) => statusToEmoji[t])
      .join('');

    const texto = `Nivra • ${new Date().toLocaleDateString()}
${emoji}

${ganhou
        ? `Resolvi em ${idxCorreto + 1}/${tentativasValidas.length}`
        : 'Não consegui dessa vez 😔'
      }`;

    try {
      await Share.share({ message: texto });
    } catch { }
  };

  const animatePress = (onPress: () => void) => ({
    onPressIn: () =>
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start(),
    onPressOut: () =>
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start(),
    onPress,
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* HEADER */}
        <Animated.View style={[styles.header, { transform: [{ scale }] }]}>
          <Text style={styles.emoji}>
            {ganhou ? '🎉' : '😔'}
          </Text>

          <Text style={[
            styles.title,
            ganhou ? styles.titleWon : styles.titleLost
          ]}>
            {ganhou ? 'Acertou!' : 'Não foi dessa vez'}
          </Text>

          <Text style={styles.subtitle}>
            {getMensagem(ganhou, idxCorreto + 1)}
          </Text>
        </Animated.View>

        {/* GRID */}
        <ResultGrid
          rows={gridRows}
          guesses={gridGuesses}
          correctIndex={idxCorreto}
        />

        {/* ACTIONS */}
        <View style={styles.actions}>
          <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
            <Pressable
              style={styles.shareButton}
              {...animatePress(handleShare)}
            >
              <Text style={styles.shareText}>
                Compartilhar resultado
              </Text>
            </Pressable>
          </Animated.View>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              resetar();
              router.replace('/menu');
            }}
          >
            <Text style={styles.secondaryText}>
              Jogar novamente
            </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 20,
  },

  header: {
    alignItems: 'center',
    gap: 8,
  },

  emoji: {
    fontSize: 52,
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
  },

  shareButton: {
    backgroundColor: Colors.button,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',

    shadowColor: Colors.button,
    shadowOpacity: 0.4,
    shadowRadius: 12,
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