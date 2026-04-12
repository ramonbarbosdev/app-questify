import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView, RefreshControl } from 'react-native-gesture-handler';

import { useJogoStore } from '@/src/store/jogoStore';
import { desafioService } from '@/src/services/desafioService';
import { AnimatedCard } from '@/src/components/AnimatedCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme/colors';

export default function Menu() {
  const [desafios, setDesafios] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const setDesafioAtual = useJogoStore((s) => s.setDesafioAtual);
  const setResultado = useJogoStore((s) => s.setResultado);

  const carregar = async () => {
    const lista = await desafioService.buscarDesafio('');
    setDesafios(lista);
  };

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => carregar(), 30000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  };

  const handleSelecionar = (d: any) => {
    setDesafioAtual(d);

    const tentativas = d?.resultado?.tentativas || [];
    const respostas = d?.resultado?.respostas || [];
    const feedbacks = d?.resultado?.feedbacks || [];

    setResultado(tentativas, respostas, feedbacks);

    if (d.flFinalizado) {
      router.push('/result');
      return;
    }

    router.push('/desafio');
  };

  return (
    <SafeAreaView style={styles.safe}>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Desafios</Text>
          <Text style={styles.subtitle}>Complete todos hoje</Text>
        </View>

        {desafios.map((d, index) => (
          <AnimatedCard key={d.idDesafio} index={index}>
            <Pressable
              onPress={() => handleSelecionar(d)}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.tipo}>{d.tpDesafio}</Text>

                {d.flFinalizado && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>✔</Text>
                  </View>
                )}
              </View>

              <Text style={styles.pergunta}>{d.dsPergunta}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.action}>
                  {d.flFinalizado ? 'Ver resultado' : 'Responder'}
                </Text>
              </View>
            </Pressable>
          </AnimatedCard>
        ))}
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.background,
    paddingBottom: 20,
  },

  header: {
    marginBottom: 20,
    marginTop: 10,
  },

  title: {
    color: Colors.primary,
    fontSize: 26,
    fontWeight: '700',
  },

  subtitle: {
    color: Colors.secondary,
    fontSize: 14,
    marginTop: 4,
  },

  card: {
    backgroundColor: Colors.surface,
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },

  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  tipo: {
    color: Colors.button,
    fontSize: 12,
    fontWeight: '600',
  },

  pergunta: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },

  cardFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  action: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },

  badge: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
  },
});