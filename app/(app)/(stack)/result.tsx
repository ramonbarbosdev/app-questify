import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useJogoStore } from '@/src/store/jogoStore';
import { Colors } from '@/src/theme/colors';

export default function Result() {
  const router = useRouter();

  const {
    tentativas,
    respostas,
    desafios,
    indiceAtual,
    setIndiceAtual,
    setDesafioAtual,
    setResultado,
    resetar,
  } = useJogoStore();

  const idxCorreto = tentativas.indexOf('correto');
  const ganhou = idxCorreto !== -1;

  const proximoPendenteIndex = desafios.findIndex(
    (desafio, index) => index > indiceAtual && !desafio.flFinalizado
  );
  const temProximo = proximoPendenteIndex !== -1;

  const fade = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  const handleNext = () => {
    if (!temProximo) {
      router.replace('/EmptyState');
      return;
    }

    setIndiceAtual(proximoPendenteIndex);
    setDesafioAtual(desafios[proximoPendenteIndex]);
    setResultado([], [], []);

    router.replace('/desafio');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, { opacity: fade }]}>

        <View style={styles.header}>
          <Text style={styles.emoji}>
            <Ionicons
              name={ganhou ? 'checkmark-circle' : 'close-circle'}
              size={42}
              color={ganhou ? '#22c55e' : '#ef4444'}
            />
          </Text>

          <Text style={styles.title}>
            {ganhou ? 'Mandou bem!' : 'Que pena'}
          </Text>

          <Text style={styles.subtitle}>
            {ganhou
              ? `Você acertou em ${idxCorreto + 1} tentativa`
              : 'Tente novamente amanhã'}
          </Text>
        </View>

        <View style={styles.grid}>
          {respostas.map((palavra, i) => (
            <View key={i} style={styles.row}>
              {palavra.split('').map((letra, j) => (
                <View key={j} style={styles.cell}>
                  <Text style={styles.cellText}>
                    {letra}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Pressable
          style={styles.primaryButton}
        >
          <Text style={styles.primaryText}>
            Compartilhar
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={handleNext}
        >
          <Text style={styles.secondaryText}>
            {temProximo ? 'Próximo desafio' : 'Aguardar novo desafio'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            resetar();
            router.replace(temProximo ? '/menu' : '/EmptyState');
          }}
        >
          <Text style={styles.secondaryText}>
            Encerrar
          </Text>
        </Pressable>

      </Animated.View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  emoji: {
    fontSize: 56,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
  },

  subtitle: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 6,
  },

  grid: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    gap: 10,
  },

  row: {
    flexDirection: 'row',
    gap: 8,
  },

  cell: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cellText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 18,
  },

  primaryButton: {
    width: '100%',
    backgroundColor: Colors.button,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },

  primaryText: {
    fontWeight: '700',
    fontSize: 16,
    color: Colors.primary,
  },

  secondaryButton: {
    marginTop: 14,
  },

  secondaryText: {
    color: Colors.secondary,
    fontSize: 13,
  },
});
