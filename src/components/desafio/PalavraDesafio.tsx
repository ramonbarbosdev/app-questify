import { usePalavraDesafio } from '@/src/hooks/usePalavraDesafio';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnswerInput } from '../AnswerInput';
import { useJogoStore } from '@/src/store/jogoStore';
import { PalavraGrid } from '../PalavraGrid';

export default function PalavraDesafio({ pergunta }: any) {
    const { resposta, setResposta, erro, enviarResposta } = usePalavraDesafio();

    const tentativas = useJogoStore((s) => s.tentativas);
    const respostas = useJogoStore((s) => s.respostas);
    const setResultado = useJogoStore((s) => s.setResultado);
    const feedbacks = useJogoStore((s) => s.feedbacks);
        console.log(feedbacks)

    const handleEnviar = async () => {
        const result = await enviarResposta();
        if (!result) return;

        if (result.finalizado) {
            const novasTentativas = [...tentativas, result.status];
           setResultado(novasTentativas, respostas, feedbacks);
            router.replace('/result');
        }
    };

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Text style={styles.pergunta}>{pergunta}</Text>
                <Text style={styles.helper}>Descubra a palavra</Text>
            </View>

            <PalavraGrid
                respostas={respostas}
                tentativas={tentativas}
                feedbacks={feedbacks} // 🔥 ESSENCIAL 
                palavraLength={5}
                maxTentativas={5}
                currentInput={resposta}
            />

            {erro && <Text style={styles.erro}>{erro}</Text>}

            <AnswerInput
                value={resposta}
                onChangeText={setResposta}
                onSubmit={handleEnviar}
                error={!!erro}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 24,
    },

    header: {
        alignItems: 'center',
        gap: 6,
    },

    pergunta: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },

    helper: {
        color: '#888',
        fontSize: 14,
    },

    erro: {
        color: '#ff4d4f',
        textAlign: 'center',
        marginTop: 8,
    },
});