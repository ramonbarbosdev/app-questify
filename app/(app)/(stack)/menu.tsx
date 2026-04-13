import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView, RefreshControl } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useJogoStore } from '@/src/store/jogoStore';
import { desafioService } from '@/src/services/desafioService';
import { Colors } from '@/src/theme/colors';
import { AnimatedCard } from '@/src/components/AnimatedCard';

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

  const onRefresh = async () => {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  };

  const total = desafios.length;
  const vitorias = desafios.filter(d => d?.resultado?.sucesso).length;
  const taxa = total > 0 ? Math.round((vitorias / total) * 100) : 0;

  const concluidos = desafios.filter(d => d.flFinalizado).length;
  const pendentes = total - concluidos;

  const streak = 0;

  const handleSelecionar = (d: any) => {
    setDesafioAtual(d);

    setResultado(
      d?.resultado?.tentativas || [],
      d?.resultado?.respostas || [],
      d?.resultado?.feedbacks || []
    );

    if (d.flFinalizado) {
      router.push('/result');
    } else {
      router.push('/desafio');
    }
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
          <Text style={styles.title}>Hoje</Text>
          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <Stat label="Desafios" value={total} />
          <Stat label="Vitórias" value={vitorias} />
          <Stat label="Taxa" value={`${taxa}%`} />
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>
            Progresso do dia
          </Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${(concluidos / total) * 100 || 0}%` },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {concluidos} de {total} concluídos
          </Text>

          {/* <View style={styles.streakRow}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>
              {streak} dias seguidos
            </Text>
          </View> */}
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Seu desempenho</Text>

          <View style={styles.historyRow}>
            {desafios.slice(0, 7).map((d, i) => (
              <View
                key={i}
                style={[
                  styles.historyDot,
                  {
                    backgroundColor: d?.resultado?.sucesso
                      ? Colors.accent
                      : Colors.error,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Desafios disponíveis
        </Text>

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
                  <Text style={styles.done}>✔</Text>
                )}
              </View>

              <Text style={styles.pergunta}>{d.dsPergunta}</Text>

              <Text style={styles.action}>
                {d.flFinalizado ? 'Ver resultado' : 'Responder'}
              </Text>
            </Pressable>
          </AnimatedCard>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

// 🔥 COMPONENTE STAT
function Stat({ label, value }: any) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    padding: 20,
    gap: 16,
  },

  header: {
    marginBottom: 10,
  },

  title: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: '700',
  },

  subtitle: {
    color: Colors.secondary,
    fontSize: 13,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  stat: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
  },

  statValue: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },

  statLabel: {
    color: Colors.secondary,
    fontSize: 12,
  },

  progressCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
  },

  progressTitle: {
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 10,
  },

  progressTrack: {
    height: 6,
    backgroundColor: '#2a2a2e',
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
  },

  progressText: {
    color: Colors.secondary,
    fontSize: 12,
    marginTop: 6,
  },

  streakRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    gap: 6,
  },

  streakEmoji: {
    fontSize: 16,
  },

  streakText: {
    color: Colors.primary,
    fontWeight: '600',
  },

  historyCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
  },

  historyTitle: {
    color: Colors.primary,
    marginBottom: 10,
  },

  historyRow: {
    flexDirection: 'row',
    gap: 6,
  },

  historyDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },

  sectionTitle: {
    color: Colors.secondary,
    fontSize: 13,
    marginTop: 10,
  },

  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
  },

  cardPressed: {
    opacity: 0.7,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tipo: {
    color: Colors.button,
    fontSize: 12,
  },

  done: {
    color: Colors.accent,
  },

  pergunta: {
    color: Colors.primary,
    marginTop: 6,
  },

  action: {
    color: Colors.accent,
    marginTop: 10,
    fontSize: 13,
  },
});