import { colors } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    // backgroundColor: 'red',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingBottom: 4,
    paddingHorizontal: 16,
    zIndex: 10, // mantém acima do conteúdo
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 12,
  },
});
