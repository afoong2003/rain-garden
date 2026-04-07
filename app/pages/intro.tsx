import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Intro() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.heading}>Why Rain Gardens?</Text>
                <Text style={styles.body}>
                    Native plant rain gardens reduce flooding, support pollinators, and strengthen
                    city stormwater systems. Most importantly, they can be beautiful and fun.
                </Text>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => router.replace('/homepage/myRainGardens')}>
                </Pressable>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7F1',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingVertical: 26,
        paddingHorizontal: 22,
        maxWidth: 520,
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.2,
    },
    body: {
        fontSize: 17,
        lineHeight: 27,
        color: '#000000',
        textAlign: 'center',
    },
});