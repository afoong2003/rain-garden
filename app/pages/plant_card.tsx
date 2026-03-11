import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Image as ExpoImage } from 'expo-image'


interface Plant {
    display_name?: string;
    scientific_name?: string;
    price_rating?: number;
    description?: string;
    bloom_start?: string;
    bloom_end?: string;
    height_min: number;
    height_max: number;
    image?: string;
    tags?: string[];
};

const tagLabels: Record<string, string> = {
    'Sun Full': 'Sunlight',
    'Sun Partial': 'Sunlight',
    'Sun Shade': 'Sunlight',
    'Moisture Dry': 'Wetness',
    'Moisture Medium': 'Wetness',
    'Moisture Wet': 'Wetness'
}

export default function PlantsPage() {
    const { plant_id } = useLocalSearchParams<{ plant_id?: string }>();
    const [plants, setPlants] = useState<Plant[]>([]);


    useEffect(() => {
        async function load_specific_plant() {
            try {

                if (!plant_id) {
                    return;
                }


                const response = await fetch(`http://192.168.0.114:8000/plants/${plant_id}`);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                const plant_data: Plant[] = await response.json();
                setPlants(plant_data)

            } catch (err) {
                console.log(err)
            } finally {
            }
        };
        load_specific_plant();
    }, [plant_id]);



    const router = useRouter();

    return (
        <SafeAreaView style={styles.page} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </Pressable>
            </View>

            <View style={styles.content}>
                {plants.map((plants) => (
                    <View>
                        <View style={styles.cardName}>
                            <Text style={styles.cardText}>{plants.display_name}</Text>
                            <Text style={styles.scientificName}> ({plants.scientific_name})</Text>
                        </View>
                        <ExpoImage
                            source={{ uri: plants.image }}
                            style={styles.cardImage}
                            contentFit="cover"
                        />

                        <View style={styles.row}>
                            <View style={styles.box}>
                                <Text>Height</Text>
                                <Text>{plants.height_min} - {plants.height_max} ft</Text>
                            </View>
                            <View style={styles.box}>
                                <Text>Bloom Time</Text>
                                <Text>{plants.bloom_start} - {plants.bloom_end}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            {plants.tags?.map((tag) => (
                                <View style={styles.box}>
                                    <Text>{tagLabels[tag] ?? 'Tag'}</Text>

                                    <Text>{tag}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.descriptionBox}>
                            <Text style={styles.description}>{plants.description}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    content: {
        paddingHorizontal: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        minWidth: 44,
        minHeight: 44,
        justifyContent: 'center',
    },
    backButtonText: {
        color: '#1d4d2f',
        fontSize: 24,
        fontWeight: '700',
    },
    plantIdText: {
        color: '#111111',
        fontSize: 16,
        fontWeight: '600',
    },
    cardImage: {
        width: '100%',
        height: 230,
        borderRadius: 16,
    },
    cardName: {
        flexDirection: 'row',
        marginBottom: 12,

    },
    cardText: {
        fontSize: 20,
        fontWeight: '700'
    },
    box: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        width: '50%'

    },
    row: {
        marginTop: 12,
        flexDirection: 'row',
        gap: 12
    },
    scientificName: {
        fontStyle: 'italic',
        color: '#555555',
        fontSize: 20
    },
    description: {
        fontSize: 16
    },
    descriptionBox: {
        backgroundColor: '#ffffff',
        marginTop: 12,
        borderRadius: 16,
        padding: 12,
        width: '100%',
        gap: 8
    },
    textCentered: {
        textAlign: 'center'
    }
});
