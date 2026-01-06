import { 
    FlatList,
    FlatListProps,
    StyleProp,
    Text,
    View,
    ViewStyle
 } from "react-native";

import { styles } from "./styles";

type Props<T> = FlatListProps<T> & {
    emptyMessage?: string;
    containerStyle?: StyleProp<ViewStyle>
}

export function List<T>({ emptyMessage, containerStyle, data, renderItem, contentContainerStyle, ...rest}: Props<T>){
    return(
        <View style={[styles.container, containerStyle]}>
            <FlatList 
                data={data}
                renderItem={renderItem}
                contentContainerStyle={[styles.listContent, contentContainerStyle]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={() => (
                    <Text style={styles.empty}>
                        {emptyMessage}
                    </Text>
                )}
                {...rest}
            />
        </View>
    )
}