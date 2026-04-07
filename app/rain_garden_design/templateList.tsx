import { Pressable, StyleSheet, View, Text } from 'react-native';
import AppScaffold from '../components/AppScaffold';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

const MOCK_TEMPLATES = [
    {
        id: "t1",
        title: "Small Corner Pollinator",
        description: "A compact 50 sq ft layout perfect for corners. High density for quick filling.",
        minimumAreaSqFt: 50,
        plants: [
            { id: "p1", name: "Swamp Milkweed", spacingInches: 18, quantity: 5 },
            { id: "p2", name: "Blue Flag Iris", spacingInches: 12, quantity: 10 },
        ]
    },
    {
        id: "t2",
        title: "The Butterfly Buffer",
        description: "A long, linear 150 sq ft layout designed to catch driveway runoff.",
        minimumAreaSqFt: 150,
        plants: [
            { id: "p3", name: "Joe-Pye Weed", spacingInches: 36, quantity: 6 },
            { id: "p4", name: "Cardinal Flower", spacingInches: 12, quantity: 20 },
            { id: "p5", name: "Fox Sedge", spacingInches: 18, quantity: 15 },
        ]
    }
];


export default function RainGardenDesigner() {
    const router = useRouter();

    const templatePage = useCallback(
        (templateId?: number) => {
            router.push({
                pathname: '/rain_garden_design/templatePage',
                params: { template_id: templateId ?? '' },
            });
        },
        [router]
    );

    return (
        <AppScaffold title="Rain Garden Templates">
            <View style={styles.container}>
                <Pressable
                    onPress={() => templatePage()}

                >
                    <View>
                        <Text style={styles.templateBox}>TEMPLATE</Text>

                    </View>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/rain_garden_design/createTemplate')}

                >
                    <View>
                        <Text style={styles.templateBox}>CREATE TEMPLATE</Text>

                    </View>
                </Pressable>
            </View>
        </AppScaffold>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    templateBox: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 16,
        width: '45%',
        height: 90

    }
    /*
    matrix: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: MATRIX_WIDTH,
        backgroundColor: '#000000',
    },
    square: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: '#ffffff',
        margin: CELL_MARGIN,
    },
    */
});
