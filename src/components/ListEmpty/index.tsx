import { View, Text} from "react-native";
import { styles } from "./styles";

import AddFilesIcon from "@/assets/addfiles-white.svg";

export function ListEmpty(){
    return(
        <View style={styles.container}> 
            <AddFilesIcon 
                height={144}
                width={144}
                fill="red"
                color="red"
            />

            <Text style={styles.heading}>
                Vamos Começar
            </Text>

            <Text style={styles.text}>
                Adicione o vício ou mau hábito{'\n'}que deseja abandonar.
            </Text>
        </View>
    )
}