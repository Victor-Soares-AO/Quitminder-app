import { ActivityIndicator } from "react-native";

import { styles } from "./styles";
import { colors } from "@/theme/colors";

export function Loading(){
    return(
        <ActivityIndicator 
            color={colors.white}
            style={styles.container}
        />
    )
}