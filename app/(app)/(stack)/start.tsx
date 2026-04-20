import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { desafioService } from '@/src/services/desafioService';
import { useJogoStore } from '@/src/store/jogoStore';
import { Colors } from '@/src/theme/colors';
import { Logo } from '@/src/components/Logo';

export default function Start() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const setDesafios = useJogoStore((s) => s.setDesafios);
    const setDesafioAtual = useJogoStore((s) => s.setDesafioAtual);
    const setIndiceAtual = useJogoStore((s) => s.setIndiceAtual);
    const setResultado = useJogoStore((s) => s.setResultado);
    const desafios = useJogoStore((s) => s.desafios);

    const pendentes = desafios.filter((d) => !d.flFinalizado).length;

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.4)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 60,
                friction: 10,
                useNativeDriver: true,
            }),
        ]).start();

        // Subtle pulse on the accent orb
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.08, duration: 2200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
            ])
        ).start();

        // Glow breathe
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 0.8, duration: 2400, useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 0.35, duration: 2400, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const carregar = useCallback(async () => {
        try {
            const lista = await desafioService.buscarDesafio();
            setDesafios(lista);
            const pendentes = lista.filter((d: any) => !d.flFinalizado);
            if (pendentes.length === 0) router.replace('/EmptyState');
        } catch (e) {
            Alert.alert('Erro ao buscar', JSON.stringify(e));
        } finally {
            setLoading(false);
        }
    }, [router, setDesafios]);

    useEffect(() => { carregar(); }, [carregar]);

    const handlePressIn = () => {
        Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
    };

    const handleStart = () => {
        const pendentes = desafios.filter((d) => !d.flFinalizado);
        if (!pendentes.length) { router.replace('/EmptyState'); return; }
        const index = desafios.findIndex((d) => !d.flFinalizado);
        setIndiceAtual(index);
        setDesafioAtual(desafios[index]);
        setResultado(
            desafios[index]?.resultado?.tentativas || [],
            desafios[index]?.resultado?.respostas || [],
            desafios[index]?.resultado?.feedbacks || []
        );
        router.replace('/desafio');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <Animated.View
                style={[styles.orbTop, { opacity: glowAnim, transform: [{ scale: pulseAnim }] }]}
            />
            <View style={styles.orbBottom} />

            <Animated.View
                style={[
                    styles.container,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
            >
                <View style={styles.headerRow}>
                     <Logo />
                </View>

                {!loading && (
                    <View style={styles.counterBlock}>
                        <Text style={styles.counterNumber}>{pendentes}</Text>
                        <Text style={styles.counterSuffix}>
                            {pendentes === 1 ? 'desafio\npendente' : 'desafios\npendentes'}
                        </Text>
                    </View>
                )}

                {loading && (
                    <View style={styles.counterBlock}>
                        <Text style={styles.loadingText}>Buscando{'\n'}desafios...</Text>
                    </View>
                )}

                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <View style={styles.dividerDiamond} />
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.metaRow}>
                    <View style={styles.metaPill}>
                        <View style={[styles.metaDot, { backgroundColor: Colors.accent }]} />
                        <Text style={styles.metaText}>Novo hoje</Text>
                    </View>
                    <View style={styles.metaPill}>
                        <View style={[styles.metaDot, { backgroundColor: Colors.yellow }]} />
                        <Text style={styles.metaText}>Sequência ativa</Text>
                    </View>
                </View>

                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Pressable
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleStart}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        disabled={loading}
                    >
                        <View style={styles.buttonGlow} />
                        <Text style={styles.buttonText}>Jogar agora</Text>
                        <View style={styles.buttonArrow}>
                            <Text style={styles.buttonArrowText}>→</Text>
                        </View>
                    </Pressable>
                </Animated.View>

                <Text style={styles.footerHint}>
                    Novos desafios desbloqueiam toda meia-noite
                </Text>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    // --- Background decoration ---
    orbTop: {
        position: 'absolute',
        top: -100,
        right: -80,
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: Colors.button,
        opacity: 0.4,
        // Soft blur effect via nested views
        shadowColor: Colors.button,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 120,
    },
    orbBottom: {
        position: 'absolute',
        bottom: -140,
        left: -100,
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: Colors.accent,
        opacity: 0.12,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 80,
    },

    // --- Main content ---
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingVertical: 40,
    },

    // Header chip
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.button,
    },
    headerLabel: {
        color: Colors.button,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 3,
    },

    // Big number
    counterBlock: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
        marginBottom: 36,
    },
    counterNumber: {
        color: Colors.primary,
        fontSize: 96,
        fontWeight: '800',
        lineHeight: 96,
        letterSpacing: -4,
    },
    counterSuffix: {
        color: Colors.secondary,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
        marginBottom: 12,
    },
    loadingText: {
        color: Colors.secondary,
        fontSize: 28,
        fontWeight: '600',
        lineHeight: 36,
    },

    // Divider
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
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
        backgroundColor: Colors.button,
        transform: [{ rotate: '45deg' }],
    },

    // Meta pills
    metaRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 40,
    },
    metaPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.surface,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    metaDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    metaText: {
        color: Colors.secondary,
        fontSize: 12,
        fontWeight: '500',
    },

    // CTA button
    button: {
        backgroundColor: Colors.button,
        paddingVertical: 18,
        paddingHorizontal: 28,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: Colors.button,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.55,
        shadowRadius: 24,
        elevation: 10,
        gap: 12,
    },
    buttonGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    buttonDisabled: {
        opacity: 0.45,
    },
    buttonText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 17,
        letterSpacing: 0.3,
    },
    buttonArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonArrowText: {
        color: Colors.primary,
        fontSize: 15,
        fontWeight: '700',
    },

    // Footer
    footerHint: {
        color: Colors.tertiary,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 24,
        letterSpacing: 0.2,
    },
});