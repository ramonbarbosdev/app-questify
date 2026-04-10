import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { useRouter } from "expo-router";

export default function HeaderHome() {


const router = useRouter()
    return (
        <View style={styles.header}>

            {/* Linha 1 */}
            <View style={styles.row}>
                <Text style={styles.title}>Desafio Diário</Text>

                {/* <TouchableOpacity onPress={() => router.push('/history')} style={styles.iconButton}>
                    <Ionicons name="time-outline" size={20} color="#AAA" />
                </TouchableOpacity> */}
            </View>

            {/* Linha 2 */}
            <Text style={styles.date}>
                {new Date().toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        paddingTop: 16,
        gap: 4,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.secondary,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    date: {
        fontSize: 13,
        color: Colors.tertiary,
    },
    iconButton: {
        padding: 8,
        borderRadius: 10,
    },
});