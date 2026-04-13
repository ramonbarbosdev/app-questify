import React, { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { Colors } from "@/src/theme/colors";
import { useQuizDesafio } from "@/src/hooks/useQuizDesafio";

export default function QuizDesafio({ pergunta, opcoes }: any) {
  const { enviarResposta } = useQuizDesafio();

  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSelect = async (opcao: string) => {
    if (status) return; // trava após resposta

    setSelecionado(opcao);

    const result = await enviarResposta(opcao);

    if (!result) return;

    setStatus(result.status);
  };

  if (!opcoes || opcoes.length === 0) {
    return (
      <View>
        <Text style={{ color: '#aaa' }}>
          Carregando opções...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* PERGUNTA */}
      <Text style={styles.pergunta}>{pergunta}</Text>

      <Text style={styles.helper}>
        Escolha a alternativa correta
      </Text>

      {/* OPÇÕES */}
      <View style={styles.options}>
        {opcoes.map((op: string, index: number) => {
          const isSelected = selecionado === op;

          const isCorreto =
            status === "correto" && isSelected;

          const isErrado =
            status === "errado" && isSelected;

          return (
            <Pressable
              key={index}
              onPress={() => handleSelect(op)}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                isCorreto && styles.optionCorrect,
                isErrado && styles.optionWrong,
              ]}
            >
              <Text style={styles.optionText}>
                {op}
              </Text>
            </Pressable>
          );
        })}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },

  pergunta: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },

  helper: {
    color: Colors.secondary,
    textAlign: "center",
    fontSize: 14,
  },

  options: {
    gap: 12,
    marginTop: 10,
  },

  option: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,

    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },

  optionSelected: {
    borderColor: Colors.accent,
  },

  optionCorrect: {
    backgroundColor: "#052e1a",
    borderColor: "#22c55e",
  },

  optionWrong: {
    backgroundColor: "#3f1d1d",
    borderColor: "#ef4444",
  },

  optionText: {
    color: Colors.primary,
    fontSize: 15,
  },
});