import { Colors } from "@/src/theme/colors";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmptyState() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Você já concluiu o desafio de hoje</Text>

            <Text style={styles.subtitle}>
                Volte amanhã para um novo desafio
            </Text>

            <Text style={styles.subtitle}>
                Próximo desafio em 08:12:45
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent:'center'
    },
    title: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        color: Colors.secondary,
        fontSize: 14,
        textAlign: "center",
    },
});