import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/src/theme/colors';

function getMsAteMeiaNoite() {
    const agora = new Date();
    const meiaNoite = new Date(agora);
    meiaNoite.setDate(agora.getDate() + 1);
    meiaNoite.setHours(0, 0, 0, 0);

    return Math.max(0, meiaNoite.getTime() - agora.getTime());
}

function formatarContador(ms: number) {
    const totalSegundos = Math.floor(ms / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    return [horas, minutos, segundos]
        .map((valor) => String(valor).padStart(2, '0'))
        .join(':');
}

export default function EmptyState() {
    const [tempoRestante, setTempoRestante] = useState(getMsAteMeiaNoite);

    const contador = useMemo(
        () => formatarContador(tempoRestante),
        [tempoRestante]
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const restante = getMsAteMeiaNoite();
            setTempoRestante(restante);

            if (restante <= 0) {
                router.replace('/start');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <View style={styles.iconWrap}>
                    <Ionicons name="time-outline" size={38} color={Colors.accent} />
                </View>

                <Text style={styles.title}>Você já concluiu os desafios de hoje</Text>

                <Text style={styles.subtitle}>
                    Novos desafios ficam disponíveis à meia-noite.
                </Text>

                <View style={styles.counterBox}>
                    <Text style={styles.counterLabel}>Próximo desafio em</Text>
                    <Text style={styles.counter}>{contador}</Text>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                    ]}
                    onPress={() => router.replace('/start')}
                >
                    <Text style={styles.buttonText}>Verificar novamente</Text>
                </Pressable>
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
        padding: 24,
    },

    iconWrap: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 22,
        borderWidth: 1,
        borderColor: Colors.surfaceLight,
    },

    title: {
        color: Colors.primary,
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },

    subtitle: {
        color: Colors.secondary,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 28,
    },

    counterBox: {
        width: '100%',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.surfaceLight,
        marginBottom: 18,
    },

    counterLabel: {
        color: Colors.secondary,
        fontSize: 13,
        marginBottom: 6,
    },

    counter: {
        color: Colors.primary,
        fontSize: 36,
        fontWeight: '700',
        letterSpacing: 0,
    },

    button: {
        width: '100%',
        backgroundColor: Colors.button,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },

    buttonPressed: {
        opacity: 0.75,
    },

    buttonText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 16,
    },
});
