import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image'

import AppScaffold from '../components/AppScaffold';

interface Plant {
    plant_id?: number;
    display_name?: string;
    scientific_name?: string;
    popularity_rating?: number;
    price_rating?: number;
    description?: string;
    image?: string;
    tags?: string[];
};

export default function PlantsPage() {
    const router = useRouter();
    const [plants, setPlants] = useState<Plant[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadPlants() {
            try {
                setLoading(true);
                setError(null);

                { /*const response = await fetch('http://104.194.109.125:8000/plants/preview'); */ }

                const response = await fetch('http://192.168.0.114:8000/plants/preview');

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                const plant_data: Plant[] = await response.json();

                setPlants(plant_data);

            } catch (err) {
                setError(err instanceof Error ? err.message : "failed")
                console.log(err)
            } finally {
                setLoading(false)
            }
        };
        loadPlants();
    }, []);

    async function searchPlant() {
        try {
            setLoading(true);

            const response = await fetch('http://104.194.106.64:8000/plants/preview');



        } catch (err) {
            console.log(err)
        }

    }


    const filteredPlants = plants;


    return (
        <AppScaffold title="Plant Database">
            <View style={styles.page}>
                <ScrollView contentContainerStyle={styles.pageContent}>
                    <Text style={styles.title}>Find Rain Garden Plants</Text>
                    <Text style={styles.subtitle}>Search by common name or scientific name.</Text>

                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search plants..."
                        placeholderTextColor="#888888"
                        style={styles.searchInput}
                    />
                    {loading ? <Text style={styles.emptyText}>Loading plants...</Text> : null}
                    {error ? <Text style={styles.emptyText}>Error: {error}</Text> : null}


                    {!loading && !error && filteredPlants.map((plant) => (
                        <Pressable
                            key={plant.plant_id}
                            style={styles.card}
                            onPress={() =>
                                router.push({
                                    pathname: '/pages/plant_card',
                                    params: {
                                        plant_id: plant.plant_id ?? ''
                                    },
                                })
                            }
                        >
                            <ExpoImage
                                source={{ uri: plant.image }}
                                style={styles.cardImage}
                                contentFit="cover"
                            />

                            <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>
                                    {plant.display_name}
                                </Text>
                                <Text style={styles.scientificName}>{plant.scientific_name}</Text>

                                {/*<Text style={styles.cardDescription}>{plant.description}</Text>*/}
                            </View>
                        </Pressable>
                    ))}

                    {filteredPlants.length === 0 ? (
                        <Text style={styles.emptyText}>No plants found for that search.</Text>
                    ) : null}

                    <StatusBar style="dark" />
                </ScrollView>
            </View>
        </AppScaffold>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    pageContent: {
        padding: 20,
        paddingBottom: 30,
    },
    title: {
        color: '#111111',
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 6,
    },
    subtitle: {
        color: '#333333',
        fontSize: 15,
        marginBottom: 16,
    },
    searchInput: {
        height: 48,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: 'black',
        color: '#111111',
        fontSize: 16,
        paddingHorizontal: 16,
        marginBottom: 18,
    },
    card: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#f5f5f5',
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,


        flexDirection: 'row',
        alignItems: 'stretch',
    },
    cardImage: {

        width: 100,
        height: 100,
        backgroundColor: '#e0e0e0',
    },
    cardBody: {

        flex: 1,
        padding: 12,
    },
    cardTitle: {
        color: '#111111',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    cardSubtitle: {
        color: '#555555',
        fontSize: 15,
        fontWeight: '500',
    },
    scientificName: {
        color: '#555555',
        fontSize: 15,
        fontWeight: '500',
        fontStyle: 'italic'
    },
    cardDescription: {
        color: '#333333',
        fontSize: 8,
        lineHeight: 22,
        marginBottom: 12,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        borderRadius: 999,
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    tagText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },
    emptyText: {
        color: '#555555',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 15,
    },
});
