import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Index() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Welcome to the Illinois Tech Rain Garden App!</Text>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => router.replace('/pages/intro')}>
                </Pressable>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        textAlign: 'center',


    }
});