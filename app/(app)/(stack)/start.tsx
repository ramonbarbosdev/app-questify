import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { desafioService } from '@/src/services/desafioService';
import { useJogoStore } from '@/src/store/jogoStore';
import { Colors } from '@/src/theme/colors';

export default function Start() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const setDesafios = useJogoStore((s) => s.setDesafios);
    const setDesafioAtual = useJogoStore((s) => s.setDesafioAtual);
    const setIndiceAtual = useJogoStore((s) => s.setIndiceAtual);

    const desafios = useJogoStore((s) => s.desafios);

    const pendentes = desafios.filter((d) => !d.flFinalizado).length;

    const textoPendentes =
        pendentes === 0
            ? 'Todos os desafios concluídos!'
            : pendentes === 1
                ? 'Você tem 1 desafio restante'
                : `Você tem ${pendentes} desafios restantes`;

    useEffect(() => {
        carregar();
    }, []);

    const carregar = async () => {
        try {
            const lista = await desafioService.buscarDesafio('');
            setDesafios(lista);

            const pendentes = lista.filter((d: any) => !d.flFinalizado);

            // todos finalizados = menu
            if (pendentes.length === 0) {
                router.replace('/menu');
                return;
            }

            // só 1 pendente = entra direto
            if (pendentes.length === 1) {
                const index = lista.findIndex((d: any) => !d.flFinalizado);

                setIndiceAtual(index);
                setDesafioAtual(lista[index]);

                router.replace('/desafio');
                return;
            }

        } finally {
            setLoading(false);
        }
    };

    const handleStart = () => {
        const pendentes = desafios.filter((d) => !d.flFinalizado);

        if (!pendentes.length) {
            router.replace('/menu');
            return;
        }

        const index = desafios.findIndex((d) => !d.flFinalizado);

        setIndiceAtual(index);
        setDesafioAtual(desafios[index]);

        router.replace('/desafio');
    };
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>

                <View style={styles.card}>

                    <Text style={styles.title}>
                        Desafio diário
                    </Text>

                    <Text style={styles.subtitle}>
                       {textoPendentes}
                    </Text>

                    <Pressable
                        style={styles.button}
                        onPress={handleStart}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            Começar
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
        justifyContent: 'center',
        padding: 24,
    },

    card: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 28,

        borderWidth: 1,
        borderColor: Colors.surfaceLight,
    },

    title: {
        color: Colors.primary,
        fontSize: 28,
        fontWeight: '700',
    },

    subtitle: {
        color: Colors.secondary,
        fontSize: 14,
        marginTop: 6,
        marginBottom: 24,
    },

    button: {
        backgroundColor: Colors.button,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },

    buttonText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 16,
    },
});