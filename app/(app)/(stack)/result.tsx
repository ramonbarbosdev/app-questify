import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useJogoStore } from '@/src/store/jogoStore';
import { Colors } from '@/src/theme/colors';

// Map tentativa result to cell color
const CELL_COLORS: Record<string, string> = {
    correto: Colors.accent,
    presente: Colors.yellow,
    incorreto: Colors.gray,
};

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
    const accentColor = ganhou ? Colors.accent : Colors.error;

    const proximoPendenteIndex = desafios.findIndex(
        (desafio, index) => index > indiceAtual && !desafio.flFinalizado
    );
    const temProximo = proximoPendenteIndex !== -1;

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const iconScale = useRef(new Animated.Value(0.4)).current;
    const iconOpacity = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0.3)).current;
    const primaryBtnScale = useRef(new Animated.Value(1)).current;
    const secondaryBtnScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Stagger: content first, then icon pops
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
        ]).start(() => {
            Animated.parallel([
                Animated.spring(iconScale, { toValue: 1, tension: 80, friction: 7, useNativeDriver: true }),
                Animated.timing(iconOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
            ]).start();
        });

        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 0.75, duration: 2400, useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 0.3, duration: 2400, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const makePressFns = (scale: Animated.Value) => ({
        onPressIn: () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start(),
        onPressOut: () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start(),
    });

    const handleNext = () => {
        if (!temProximo) { router.replace('/EmptyState'); return; }
        setIndiceAtual(proximoPendenteIndex);
        setDesafioAtual(desafios[proximoPendenteIndex]);
        setResultado([], [], []);
        router.replace('/desafio');
    };

    const handleEnd = () => {
        resetar();
        router.replace(temProximo ? '/menu' : '/EmptyState');
    };

    return (
        <SafeAreaView style={styles.safe}>
            {/* Ambient orb */}
            <Animated.View
                style={[
                    styles.ambientOrb,
                    { backgroundColor: accentColor, opacity: glowAnim },
                ]}
            />

            <Animated.View
                style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
            >
                {/* ── Result icon ── */}
                <Animated.View
                    style={[
                        styles.iconRing,
                        {
                            borderColor: `${accentColor}55`,
                            backgroundColor: `${accentColor}11`,
                            shadowColor: accentColor,
                            transform: [{ scale: iconScale }],
                            opacity: iconOpacity,
                        },
                    ]}
                >
                    <View style={[styles.iconInner, { backgroundColor: `${accentColor}20` }]}>
                        <Ionicons
                            name={ganhou ? 'checkmark-circle' : 'close-circle'}
                            size={44}
                            color={accentColor}
                        />
                    </View>
                </Animated.View>

                {/* ── Label + title ── */}
                <View style={styles.labelRow}>
                    <View style={[styles.labelDot, { backgroundColor: accentColor }]} />
                    <Text style={[styles.labelText, { color: accentColor }]}>
                        {ganhou ? 'ACERTOU!' : 'ERROU'}
                    </Text>
                </View>

                <Text style={styles.title}>
                    {ganhou ? 'Mandou bem!' : 'Que pena…'}
                </Text>

                <Text style={styles.subtitle}>
                    {ganhou
                        ? `Você acertou na ${idxCorreto + 1}ª tentativa`
                        : 'Tente novamente amanhã'}
                </Text>

                {/* ── Word grid ── */}
                {respostas.length > 0 && (
                    <View style={styles.gridBlock}>
                        <View style={styles.cardLabelRow}>
                            <View style={[styles.cardLabelDot, { backgroundColor: Colors.button }]} />
                            <Text style={styles.cardLabelText}>SUAS TENTATIVAS</Text>
                        </View>

                        <View style={styles.attemptsContainer}>
                            {respostas.map((palavra, i) => {
                                const status = tentativas[i] ?? 'incorreto';
                                const isLast = i === idxCorreto;
                                const isQuiz = desafios[indiceAtual]?.tpDesafio === 'QUIZ';

                                // Se for QUIZ, renderiza uma bolha de texto simples
                                if (isQuiz) {
                                    return (
                                        <View key={i} style={[
                                            styles.quizAttemptBubble,
                                            {
                                                backgroundColor: isLast ? `${Colors.accent}22` : `${Colors.gray}22`,
                                                borderColor: isLast ? Colors.accent : Colors.gray
                                            }
                                        ]}>
                                            <Text style={[styles.quizAttemptText, { color: isLast ? Colors.accent : Colors.primary }]}>
                                                {palavra}
                                            </Text>
                                            <Ionicons
                                                name={isLast ? "checkmark-circle" : "close-circle"}
                                                size={16}
                                                color={isLast ? Colors.accent : Colors.gray}
                                            />
                                        </View>
                                    );
                                }

                                // Se for PALAVRA, mantém o Grid original
                                return (
                                    <View key={i} style={styles.row}>
                                        {palavra.split('').map((letra, j) => {
                                            const cellColor = isLast || status === 'correto' ? Colors.accent : Colors.gray;
                                            return (
                                                <View
                                                    key={j}
                                                    style={[
                                                        styles.cell,
                                                        {
                                                            backgroundColor: `${cellColor}22`,
                                                            borderColor: `${cellColor}66`,
                                                            shadowColor: isLast ? Colors.accent : 'transparent',
                                                        },
                                                    ]}
                                                >
                                                    <Text style={[styles.cellText, { color: isLast ? Colors.accent : Colors.primary }]}>
                                                        {letra.toUpperCase()}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* ── Divider ── */}
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <View style={[styles.dividerDiamond, { backgroundColor: accentColor }]} />
                    <View style={styles.dividerLine} />
                </View>

                {/* ── Actions ── */}
                <View style={styles.actions}>
                    {/* Share */}
                    <Animated.View style={[styles.btnWrap, { transform: [{ scale: primaryBtnScale }] }]}>
                        <Pressable
                            style={styles.primaryButton}
                            {...makePressFns(primaryBtnScale)}
                        >
                            <View style={styles.buttonGlow} />
                            <Ionicons name="share-social-outline" size={18} color={Colors.primary} />
                            <Text style={styles.primaryText}>Compartilhar</Text>
                        </Pressable>
                    </Animated.View>

                    {/* Next */}
                    <Animated.View style={[styles.btnWrap, { transform: [{ scale: secondaryBtnScale }] }]}>
                        <Pressable
                            style={styles.secondaryButton}
                            onPress={handleNext}
                            {...makePressFns(secondaryBtnScale)}
                        >
                            <Text style={styles.secondaryText}>
                                {temProximo ? 'Próximo desafio' : 'Aguardar novo desafio'}
                            </Text>
                            <Ionicons name="arrow-forward" size={14} color={Colors.secondary} />
                        </Pressable>
                    </Animated.View>

                    {/* End */}
                    <Pressable onPress={handleEnd} style={styles.ghostButton}>
                        <Text style={styles.ghostText}>Encerrar</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    ambientOrb: {
        position: 'absolute',
        top: -100,
        right: -80,
        width: 300,
        height: 300,
        borderRadius: 150,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 120,
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
        gap: 0,
    },

    // Icon
    iconRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
    },
    iconInner: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Label
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    labelDot: { width: 6, height: 6, borderRadius: 3 },
    labelText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 3,
    },

    title: {
        color: Colors.primary,
        fontSize: 30,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    subtitle: {
        color: Colors.secondary,
        fontSize: 14,
        marginBottom: 28,
    },

    // Grid
    gridBlock: {
        width: '100%',
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: Colors.gray,
        marginBottom: 24,
        gap: 14,
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
    grid: {
        alignItems: 'center',
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    cell: {
        width: 48,
        height: 48,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
    },
    cellText: {
        fontWeight: '800',
        fontSize: 17,
        letterSpacing: 0.5,
    },

    // Divider
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.gray,
    },
    dividerDiamond: {
        width: 6,
        height: 6,
        borderRadius: 1,
        transform: [{ rotate: '45deg' }],
    },

    // Actions
    actions: {
        width: '100%',
        gap: 10,
    },
    btnWrap: { width: '100%' },

    primaryButton: {
        backgroundColor: Colors.button,
        paddingVertical: 17,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: Colors.button,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        gap: 10,
    },
    buttonGlow: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '50%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    primaryText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 16,
    },

    secondaryButton: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.gray,
        paddingVertical: 15,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryText: {
        color: Colors.secondary,
        fontWeight: '600',
        fontSize: 14,
    },

    ghostButton: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    ghostText: {
        color: Colors.tertiary,
        fontSize: 13,
        fontWeight: '500',
    },

    // Adicione dentro de styles:
    attemptsContainer: {
        alignItems: 'center',
        gap: 8,
        width: '100%',
    },
    quizAttemptBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        width: '100%', // Ocupa a largura total do card
        gap: 10,
    },
    quizAttemptText: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1, // Faz o texto ocupar o espaço e quebrar linha se necessário
    },
});