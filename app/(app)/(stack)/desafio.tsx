import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useDesafio } from '@/src/hooks/useDesafio';
import { Colors } from '@/src/theme/colors';
import { AnswerInput } from '@/src/components/AnswerInput';
import { IndicatorTentativa } from '@/src/components/IndicatorTentativa';
import { useJogoStore } from '@/src/store/jogoStore';

export default function DesafioScreen() {

  const {
    resposta,
    setResposta,
    erro,
    enviarResposta,
  } = useDesafio();

  const desafioAtual = useJogoStore((s) => s.desafioAtual);
  const tentativas = useJogoStore((s) => s.tentativas);
  const respostas = useJogoStore((s) => s.respostas);
  const setResultado = useJogoStore((s) => s.setResultado);

  useEffect(() => {
    if (!desafioAtual) {
      router.replace('/menu');
    }
  }, [desafioAtual]);

  if (!desafioAtual) return null;

  const handleEnviar = async () => {
    const result = await enviarResposta();

    if (!result) return;

    if (result.finalizado) {
      const novasTentativas = [...tentativas, result.status];

      setResultado(novasTentativas, respostas);

      router.replace('/result');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pergunta}>
        {desafioAtual.dsPergunta}
      </Text>

      <IndicatorTentativa
        tentativas={tentativas}
        maxTentativas={5}
      />

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <AnswerInput
        value={resposta}
        onChangeText={setResposta}
        onSubmit={handleEnviar}
        disabled={false}
        error={!!erro}
      />

      <Pressable onPress={() => router.back()}>
        <Text style={styles.voltar}>Voltar</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  pergunta: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  erro: {
    color: 'red',
    textAlign: 'center',
  },
  voltar: {
    color: '#aaa',
    marginTop: 20,
    textAlign: 'center',
  },
  finalizar: {
    color: Colors.button,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
});