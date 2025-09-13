import { LinearGradient } from "expo-linear-gradient";

import { styles } from "./styles";
import { colors } from "@/theme";

export function HeaderGradient(){
    return(
        <LinearGradient
            colors={[colors.indigo[950],colors.background.primary]}
            style={styles.container}
        />
    )
}