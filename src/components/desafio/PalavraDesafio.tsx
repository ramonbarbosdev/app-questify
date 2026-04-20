import { usePalavraDesafio } from '@/src/hooks/usePalavraDesafio';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnswerInput } from '../AnswerInput';
import { useJogoStore } from '@/src/store/jogoStore';
import { PalavraGrid } from '../PalavraGrid';
import { Colors } from '@/src/theme/colors';

export default function PalavraDesafio({ pergunta }: any) {
    const { resposta, setResposta, erro, enviarResposta } = usePalavraDesafio();

    const tentativas = useJogoStore((s) => s.tentativas);
    const respostas = useJogoStore((s) => s.respostas);
    const setResultado = useJogoStore((s) => s.setResultado);
    const feedbacks = useJogoStore((s) => s.feedbacks);
    const desafioAtual = useJogoStore((s) => s.desafioAtual);

    console.log(desafioAtual)

    const handleEnviar = async () => {
        const result = await enviarResposta();


        if (!result) return;

        if (result.finalizado) {
            const novasTentativas = [...tentativas, result.status];
            const novasRespostas = [...respostas, result.resposta].filter((r): r is string => r !== undefined);
            const novosFeedbacks = [...feedbacks, result.feedback];

            setResultado(
                novasTentativas,
                novasRespostas,
                novosFeedbacks
            );

            setTimeout(() => {
                router.replace('/result');
            }, 1000);
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
                feedbacks={feedbacks}
                palavraLength={desafioAtual.nuTamanhoResposta}
                maxTentativas={desafioAtual.nuMaximoTentativa}
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
        height: "80%",
        justifyContent: 'space-between',
    },

    header: {
        alignItems: 'center',
        gap: 6,
    },

    pergunta: {
        color: Colors.primary,
        fontSize: 20,
        fontWeight: '600',
    },

    helper: {
        color: Colors.secondary,
        fontSize: 14,
    },

    erro: {
        color: Colors.error,
        textAlign: 'center',
        marginTop: 8,
    },
});