import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import AppScaffold from '../components/AppScaffold';

export default function Home() {
    return (
        <AppScaffold title="Dashboard">
            <View style={styles.container}>

                <View style={styles.metricsRow}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>????</Text>
                        <Text style={styles.metricLabel}>?????</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricValue}>9</Text>
                        <Text style={styles.metricLabel}>Plants in Bloom</Text>
                    </View>
                </View>

                <View style={styles.alertCard}>
                    <Text style={styles.alertTitle}>Today&apos;s Focus</Text>
                    <Text style={styles.alertText}>Clear debris from the inlet and check for pooled water after rain.</Text>
                </View>

                <StatusBar style="dark" />
            </View>
        </AppScaffold>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    title: {
        color: '#111111',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        color: '#333333',
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 24,
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 14,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d4d4d4',
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    metricValue: {
        color: '#111111',
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 6,
    },
    metricLabel: {
        color: '#555555',
        fontSize: 14,
        fontWeight: '500',
    },
    alertCard: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d4d4d4',
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    alertTitle: {
        color: '#111111',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 6,
    },
    alertText: {
        color: '#333333',
        fontSize: 15,
        lineHeight: 22,
    },
});
