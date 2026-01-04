import { View, Text} from "react-native";
import { styles } from "./styles";

import AddFilesIcon from "@/assets/addfiles-white.svg";
import { Heading } from "../Text/Heading";
import { useTranslation } from "@/hooks/useTranslation";

export function ListEmpty(){
    const { t } = useTranslation();
    
    return(
        <View style={styles.container}> 
            <AddFilesIcon 
                height={144}
                width={144}
                fill="red"
                color="red"
            />

            <Heading>
                {t("habit.create")}
            </Heading>

            <Text style={styles.text}>
                {t("habit.createDescription")}
            </Text>
        </View>
    )
}