import { Colors } from "@/src/theme/colors";
import { View, Text, StyleSheet } from "react-native";

const historyData = [
  { date: "2026-04-01", status: "SUCCESS" },
  { date: "2026-04-02", status: "FAIL" },
  { date: "2026-04-03", status: "PARTIAL" },
];

const getColor = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return  Colors.accent;
    case "PARTIAL":
      return Colors.yellow;
    default:
      return Colors.gray;
  }
};

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>

      <View style={styles.grid}>
        {historyData.map((item, index) => (
          <View
            key={index}
            style={[
              styles.cell,
              { backgroundColor: getColor(item.status) },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  Colors.background,
    padding: 24,
  },
  title: {
    color: Colors.primary,
    fontSize: 18,
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cell: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
});