import { useNumeroDesafio } from "@/src/hooks/useNumeroDesafio";
import { useJogoStore } from "@/src/store/jogoStore";
import { router } from "expo-router";
import { IndicatorTentativa } from "../IndicatorTentativa";
import { AnswerInput } from "../AnswerInput";
import { View, Text, StyleSheet } from 'react-native';
import { NumeroTermometro } from "../NumeroTermometro";
import { Colors } from "@/src/theme/colors";

export default function NumeroDesafio({ pergunta }: any) {
  const { resposta, setResposta, erro, enviarResposta } = useNumeroDesafio();

  const tentativas = useJogoStore((s) => s.tentativas);
  const respostas = useJogoStore((s) => s.respostas);
  const feedbacks = useJogoStore((s) => s.feedbacks);
  const setResultado = useJogoStore((s) => s.setResultado);

  const handleEnviar = async () => {
    const result = await enviarResposta();
    if (!result) return;

    if (result.finalizado) {
      const novasTentativas = [...tentativas, result.status];

      setResultado(novasTentativas, respostas, feedbacks);

      setTimeout(() => {
        router.replace('/result');
      }, 700);
    }
  };

  return (
    <View style={styles.screen}>

      <View style={styles.header}>
        <Text style={styles.pergunta}>{pergunta}</Text>
        <Text style={styles.helper}>Tente descobrir o número</Text>
      </View>

      <View style={styles.termometroContainer}>
        <NumeroTermometro tentativas={tentativas} />
      </View>

      <IndicatorTentativa tentativas={tentativas} maxTentativas={5} />

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <View style={styles.inputWrapper}>
        <AnswerInput
          value={resposta}
          onChangeText={setResposta}
          onSubmit={handleEnviar}
          error={!!erro}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'space-between',
    height: "70%"
  },

  header: {
    alignItems: 'center',
  },

  pergunta: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  helper: {
    color: Colors.secondary,
    fontSize: 14,
  },

  termometroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  inputWrapper: {
    marginTop: 12,
  },

  erro: {
    color: Colors.error,
    textAlign: 'center',
    marginTop: 8,
    fontSize: 13,
  },
});