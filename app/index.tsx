import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppScaffold from './components/AppScaffold';


export default function Index() {
    const router = useRouter();

    return (
        <AppScaffold title='Survey'>
            <View style={styles.container}>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.title}>Site Conditions</Text>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => router.replace('/pages/dashboard')}
                    />
                </SafeAreaView>
            </View>
        </AppScaffold>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 24,
        padding: 10,
        marginBottom: 120

    }
});