import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
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

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const carregar = async () => {
    const lista = await desafioService.buscarDesafio();
    if (!lista.length) { router.replace('/EmptyState'); return; }

    setDesafios(lista);

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 12, useNativeDriver: true }),
    ]).start();
  };

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      slideAnim.setValue(24);
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
  const progressoPct = total > 0 ? (concluidos / total) * 100 : 0;

  const handleSelecionar = (d: any) => {
    setDesafioAtual(d);
    setResultado(
      d?.resultado?.tentativas || [],
      d?.resultado?.respostas || [],
      d?.resultado?.feedbacks || []
    );
    if (d.flFinalizado) router.push('/result');
    else router.push('/desafio');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Ambient glow top-right */}
      <View style={styles.ambientOrb} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.button}
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>DESAFIO DIÁRIO</Text>
              <Text style={styles.title}>Hoje</Text>
              <Text style={styles.subtitle}>
                {new Date().toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </Text>
            </View>

            {/* Pending badge */}
            {pendentes > 0 && (
              <View style={styles.pendenteBadge}>
                <Text style={styles.pendenteNum}>{pendentes}</Text>
                <Text style={styles.pendenteLabel}>restantes</Text>
              </View>
            )}
          </View>

          {/* ── Progress bar full-width ── */}
          <View style={styles.progressBlock}>
            <View style={styles.progressMeta}>
              <Text style={styles.progressLabel}>Progresso do dia</Text>
              <Text style={styles.progressPct}>{Math.round(progressoPct)}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[styles.progressFill, { width: `${progressoPct}%` }]}
              />
              {/* Glow tip */}
              {progressoPct > 2 && (
                <View style={[styles.progressGlow, { left: `${progressoPct}%` }]} />
              )}
            </View>
            <Text style={styles.progressSub}>
              {concluidos} de {total} concluídos
            </Text>
          </View>

          {/* ── Stats row ── */}
          <View style={styles.statsRow}>
            <StatCard label="Total" value={total} accent={Colors.secondary} />
            <StatCard label="Vitórias" value={vitorias} accent={Colors.accent} />
            <StatCard label="Taxa" value={`${taxa}%`} accent={Colors.yellow} />
          </View>

          {/* ── Performance strip ── */}
          {desafios.length > 0 && (
            <View style={styles.performanceCard}>
              <View style={styles.performanceHeader}>
                <View style={styles.cardLabelRow}>
                  <View style={[styles.cardLabelDot, { backgroundColor: Colors.button }]} />
                  <Text style={styles.cardLabelText}>SEU DESEMPENHO</Text>
                </View>
                <Text style={styles.performanceLegend}>
                  <Text style={{ color: Colors.accent }}>■</Text>
                  {' '}vitória{'  '}
                  <Text style={{ color: Colors.error }}>■</Text>
                  {' '}derrota
                </Text>
              </View>

              <View style={styles.historyRow}>
                {desafios.slice(0, 7).map((d, i) => (
                  <View key={i} style={styles.historyDotWrapper}>
                    <View
                      style={[
                        styles.historyDot,
                        {
                          backgroundColor: !d.flFinalizado
                            ? Colors.gray
                            : d?.resultado?.sucesso
                              ? Colors.accent
                              : Colors.error,
                        },
                      ]}
                    />
                    {d.flFinalizado && (
                      <View
                        style={[
                          styles.historyDotGlow,
                          {
                            backgroundColor: d?.resultado?.sucesso
                              ? Colors.accent
                              : Colors.error,
                          },
                        ]}
                      />
                    )}
                  </View>
                ))}
                {/* Spacer dots if less than 7 */}
                {Array.from({ length: Math.max(0, 7 - desafios.slice(0, 7).length) }).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.historyDotWrapper}>
                    <View style={[styles.historyDot, { backgroundColor: Colors.gray, opacity: 0.3 }]} />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Section title ── */}
          <View style={styles.sectionRow}>
            <View style={styles.sectionLine} />
            <Text style={styles.sectionTitle}>Desafios</Text>
            <View style={styles.sectionLine} />
          </View>

          {/* ── Challenge cards ── */}
          {desafios.map((d, index) => (
            <AnimatedCard key={d.idDesafio} index={index}>
              <ChallengeCard
                desafio={d}
                index={index}
                onPress={() => handleSelecionar(d)}
              />
            </AnimatedCard>
          ))}

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, accent }: { label: string; value: any; accent: string }) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statAccentBar, { backgroundColor: accent }]} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Challenge Card ───────────────────────────────────────────────────────────
function ChallengeCard({ desafio: d, index, onPress }: any) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.975, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  const isDone = d.flFinalizado;
  const isWin = d?.resultado?.sucesso;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.card}
      >
        {/* Left accent bar */}
        <View
          style={[
            styles.cardAccentBar,
            {
              backgroundColor: isDone
                ? isWin ? Colors.accent : Colors.error
                : Colors.button,
            },
          ]}
        />

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.tipoBadge}>
              <Text style={styles.tipoText}>{d.tpDesafio}</Text>
            </View>

            {isDone && (
              <View style={[
                styles.doneBadge,
                { backgroundColor: isWin ? `${Colors.accent}22` : `${Colors.error}22` }
              ]}>
                <Text style={[styles.doneText, { color: isWin ? Colors.accent : Colors.error }]}>
                  {isWin ? '✔ Vencido' : '✘ Falhou'}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.pergunta} numberOfLines={2}>
            {d.dsPergunta}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={[
              styles.action,
              { color: isDone ? Colors.secondary : Colors.button }
            ]}>
              {isDone ? 'Ver resultado →' : 'Responder →'}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  ambientOrb: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.button,
    opacity: 0.18,
    shadowColor: Colors.button,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 14,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  eyebrow: {
    color: Colors.button,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 4,
  },
  title: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.secondary,
    fontSize: 13,
    marginTop: 2,
    textTransform: 'capitalize',
  },

  // Pending badge
  pendenteBadge: {
    backgroundColor: `${Colors.button}22`,
    borderWidth: 1,
    borderColor: `${Colors.button}55`,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pendenteNum: {
    color: Colors.button,
    fontSize: 22,
    fontWeight: '800',
  },
  pendenteLabel: {
    color: Colors.button,
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.8,
  },

  // Progress
  progressBlock: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginBottom: 10
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  progressPct: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.gray,
    borderRadius: 999,
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 999,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  progressGlow: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    opacity: 0.4,
    marginLeft: -8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  progressSub: {
    color: Colors.secondary,
    fontSize: 11,
    marginTop: 8,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gray,
    overflow: 'hidden',
    marginBottom: 10
  },
  statAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  statValue: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
    letterSpacing: -0.5,
  },
  statLabel: {
    color: Colors.secondary,
    fontSize: 11,
    marginTop: 2,
  },

  // Performance
  performanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardLabelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardLabelText: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  performanceLegend: {
    color: Colors.tertiary,
    fontSize: 11,
  },
  historyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  historyDotWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDot: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  historyDotGlow: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 8,
    opacity: 0.25,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },

  // Section divider
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 5
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray,
  },
  sectionTitle: {
    color: Colors.tertiary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },

  // Challenge card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gray,
    marginBottom: 10,
  },
  cardAccentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  cardContent: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipoBadge: {
    backgroundColor: `${Colors.button}22`,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tipoText: {
    color: Colors.button,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  doneBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  doneText: {
    fontSize: 11,
    fontWeight: '700',
  },
  pergunta: {
    color: Colors.primary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  cardFooter: {
    marginTop: 2,
  },
  action: {
    fontSize: 12,
    fontWeight: '600',
  },
});