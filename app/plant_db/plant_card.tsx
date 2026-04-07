import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Plant {
    display_name?: string;
    scientific_name?: string;
    price_rating: number;
    description?: string;
    bloom_start?: string;
    bloom_end?: string;
    height_min: number;
    height_max: number;
    image?: string;
    popularity_rating: number;
    form?: string;
    soil?: string;
    pos_base?: string;
    pos_slope?: string;
    pos_margin?: string;
    space_min: number;
    space_max: number;
};

export default function PlantsPage() {
    const { plant_id } = useLocalSearchParams<{ plant_id?: string }>();
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        async function load_specific_plant() {
            try {
                setLoading(true);
                setError(null);

                if (!plant_id) {
                    setError('Missing plant id');
                    return;
                }

                const response = await fetch(`http://0.0.0.0:8000/plants/${plant_id}`);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                const plant_data = await response.json();
                const normalized_data: Plant[] = Array.isArray(plant_data) ? plant_data : [plant_data];
                setPlants(normalized_data)

            } catch (err) {
                console.log(err)
                setError('Could not load plant details');
            } finally {
                setLoading(false);
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
                {loading ? <Text style={styles.stateText}>Loading plant...</Text> : null}
                {error ? <Text style={styles.stateText}>{error}</Text> : null}
                {!loading && !error && plants.length === 0 ? (
                    <Text style={styles.stateText}>No plant details found.</Text>
                ) : null}
                {plants.map((plants) => {
                    function popularityIcon(popularity: number) {
                        let starCount = 1;

                        if (popularity > 3) {
                            starCount = 5;
                        } else if (popularity === 3) {
                            starCount = 2;
                        }
                        return (
                            <View style={{ flexDirection: 'row' }}>
                                {Array.from({ length: starCount }).map((_, index) => (
                                    <Entypo
                                        key={index}
                                        name="star"
                                        size={22}
                                        color="gold"
                                    />
                                ))}
                            </View>
                        );
                    }

                    function priceIcon(price: number) {
                        let dollarCount = 1
                        if (price > 3) {
                            dollarCount = 5;
                        } else if (price === 3) {
                            dollarCount = 2;
                        }
                        return (
                            <View style={{ flexDirection: 'row' }}>
                                {Array.from({ length: dollarCount }).map((_, index) => (
                                    <FontAwesome
                                        key={index}
                                        name="dollar"
                                        size={20}
                                        color="black"
                                    />
                                ))}
                            </View>
                        );
                    }

                    function position(base?: string, slope?: string, margin?: string): string {
                        const parts = [base, slope, margin].filter(
                            (value): value is string =>
                                typeof value === 'string' && value.trim().length > 0
                        );

                        return parts.length > 0 ? parts.join(' / ') : 'Not specified';
                    }

                    return (
                        <View key={`${plants.display_name}`}>
                            <View style={styles.cardImage}>
                                <Image
                                    source={{ uri: plants.image }}
                                    style={StyleSheet.absoluteFillObject}
                                    contentFit="cover"
                                    cachePolicy="memory-disk"
                                    transition={120}
                                />

                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                                    style={styles.cardNameGradient}
                                >
                                    <View style={styles.cardOverlayContent}>
                                        <View style={styles.cardName}>
                                            <Text style={styles.displayName}>{plants.display_name}</Text>
                                            <Text style={styles.scientificName}>{plants.scientific_name}</Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.box}>
                                    {popularityIcon(plants.popularity_rating)}

                                    <Text style={{ fontSize: 12, letterSpacing: 1 }}>POPULARITY</Text>

                                </View>
                                <View style={styles.box}>
                                    {priceIcon(plants.price_rating)}
                                    <Text style={{ fontSize: 12, letterSpacing: 2 }}>PRICE</Text>
                                </View>
                                <View style={styles.box}>
                                    <Text>{plants.height_min}' - {plants.height_max}'</Text>
                                    <Text style={{ fontSize: 12, letterSpacing: 1 }}>PLANT HEIGHT</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.box}>
                                    <Text>{plants.bloom_start} - {plants.bloom_end}</Text>


                                    <Text style={{ fontSize: 12, letterSpacing: 1 }}>BLOOM PERIOD</Text>

                                </View>
                                <View style={styles.box}>
                                    <Text>{plants.space_min}' - {plants.space_max}'</Text>


                                    <Text style={{ fontSize: 12, letterSpacing: 1 }}>Space Between Plants</Text>

                                </View>
                                <View style={styles.box}>
                                    <Text>{position(plants.pos_base, plants.pos_slope, plants.pos_margin)}</Text>
                                    <Text style={{ fontSize: 12, letterSpacing: 1 }}>POSITION</Text>

                                </View>
                            </View>


                        </View>
                    );
                })}
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
    cardNameGradient: {
        width: '100%',
        paddingTop: 80,
        paddingBottom: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderRadius: 16

    },
    cardImage: {
        width: '100%',
        height: 190,
        overflow: 'hidden',
        justifyContent: 'flex-end',
        borderRadius: 16

    },
    imageStyle: {
        borderRadius: 16,


    },
    cardName: {
        marginBottom: 16,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    displayName: {
        color: 'white',
        fontSize: 32,
    },
    scientificName: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        fontStyle: 'italic',
    },
    box: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        width: '32%',
        height: 65

    },
    row: {
        marginTop: 12,
        flexDirection: 'row',
        gap: 8,
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
    },
    stateText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#444',
        fontSize: 16,
    },
    cardOverlayContent: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});
