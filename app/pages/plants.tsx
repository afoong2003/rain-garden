import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { FlatList, ListRenderItem, Pressable, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [debounce, setDebounce] = useState('');
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['65%'], []);
    const sunFilters = ['Full Sun', 'Partial Sun', 'Sun Shade']
    const moistureFilters = ['Wet Moisture', 'Medium Moisture', 'Dry Moisture']
    const [selectedSun, setSun] = useState<string | null>(null);
    const [selectedMoisture, setMoisture] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeKey, setActiveKey] = useState('');

    const filterInfo: Record<string, string> = {
        'Sun Exposure': `Full Sun: Plant thrives with >6 hours of sunlight during the growing period.
Partial Sun: Plant thrives with 3 - 6 hours of sunlight during the growing period.
Sun Shade: Plant thrives with < 3 hours of sunlight during the growing period.
        `,
        'Plant Moisture': `Wet Moisture: Plant thrives in wet soil; soggy or marshy most of the time.
Medium Moisture: Plant thrives in average soil; water can soak in without runoff.
Dry Moisture: Plant thrives in dry soil; water is excessively drained.
                `,
    }

    type filterModalProps = {
        visible: boolean;
        onClose: () => void;
        filterKey: string;
    };

    const FilterInfoModal = ({ visible, onClose, filterKey }: filterModalProps) => {
        const filterText = filterInfo[filterKey]
        return (
            <Modal
                animationType="fade"
                transparent
                visible={visible}
                onRequestClose={onClose}
            >
                <Pressable style={styles.modalBackdrop} onPress={onClose}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>{filterKey}</Text>
                        <Text style={styles.modalBody}>{filterText}</Text>
                        <Pressable onPress={onClose} style={styles.modalCloseButton}>
                            <Text style={styles.modalCloseText}>Close</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        );
    };

    const openModalWithKey = (filterKey: string) => {
        setActiveKey(filterKey);
        setModalVisible(true);
    };

    const plantPage = useCallback(
        (plantId?: number) => {
            router.push({
                pathname: '/pages/plant_card',
                params: { plant_id: plantId ?? '' },
            });
        },
        [router]
    );

    const renderPlantItem: ListRenderItem<Plant> = useCallback(
        ({ item }) => (
            <Pressable
                key={item.plant_id}
                style={styles.card}
                onPress={() => plantPage(item.plant_id)}
            >
                <ExpoImage
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                    contentFit="cover"
                />
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{item.display_name}</Text>
                    <Text style={styles.scientificName}>{item.scientific_name}</Text>
                </View>
                <View style={styles.heartIcon}>
                    <Pressable>
                        <Ionicons name="heart-outline" size={26} color="black" />
                        <Ionicons name="heart-sharp" size={24} color="pink" />
                    </Pressable>
                </View>
            </Pressable>
        ),
        [plantPage]
    );

    const openSheet = () => {
        bottomSheetRef.current?.present();
    };

    async function applyFilter() {
        try {
            const response = await fetch('http://192.168.0.114:8000/plants/filter')
            const filtered_plants: Plant[] = await response.json()

            setPlants(filtered_plants)

        } catch (e) {
            console.log(e)
        }
    }

    const closeSheet = () => {
        bottomSheetRef.current?.dismiss();
        applyFilter();
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebounce(query.trim().toLocaleLowerCase());
        }, 300);

        return () => {
            clearTimeout(timerId);
        };
    }, [query])

    useEffect(() => {
        async function fetchPlants() {
            try {
                let url

                if (!debounce) {
                    url = 'http://192.168.0.114:8000/plants/preview'
                } else {
                    url = `http://192.168.0.114:8000/plants/search?q=${encodeURIComponent(debounce)}`

                }

                const response = await fetch(url);

                const data: Plant[] = await response.json();
                setPlants(data)

            } catch (err) {

            }
        }
        fetchPlants()
    }, [debounce])

    return (
        <AppScaffold title="Plant Database">
            <View style={styles.page}>
                <View style={styles.pageContent}>
                    <View style={styles.searchRow}>
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Search plants..."
                            placeholderTextColor="#888888"
                            selectionColor="black"
                            style={styles.searchInput}
                        />
                        <View style={styles.filterIcon}>
                            <Pressable onPress={openSheet}>
                                <MaterialCommunityIcons name="filter-outline" size={24} color="black" />
                            </Pressable>
                        </View>
                    </View>

                    {loading ? <Text style={styles.emptyText}>Loading plants...</Text> : null}
                    {error ? <Text style={styles.emptyText}>Error: {error}</Text> : null}
                </View>
                <FlatList
                    data={!loading && !error ? plants : []}
                    renderItem={renderPlantItem}
                    keyExtractor={(item, index) => String(item.plant_id ?? index)}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        !loading && !error ? (
                            <Text style={styles.emptyText}>No plants found for that search.</Text>
                        ) : null
                    }
                    keyboardShouldPersistTaps="handled"
                />

                <BottomSheetModal
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    enableDynamicSizing={false}
                    enablePanDownToClose={true}
                    backdropComponent={(props) => (
                        <BottomSheetBackdrop
                            {...props}
                            appearsOnIndex={0}
                            disappearsOnIndex={-1}
                            pressBehavior="close"
                            opacity={0.45}
                        />
                    )}
                >
                    <BottomSheetView style={styles.sheetContent}>
                        <Text style={{ fontSize: 22, fontWeight: '600', textAlign: 'center' }}>
                            Filter Plants
                        </Text>
                        <View style={styles.iconAndTitle}>
                            <Text style={styles.sheetTitle}>Sun Exposure</Text>
                            <Pressable onPress={() => openModalWithKey('Sun Exposure')}>
                                <FontAwesome5 name="question-circle" size={16} color="black" />
                            </Pressable>
                            <FilterInfoModal
                                visible={modalVisible}
                                onClose={() => setModalVisible(false)}
                                filterKey={activeKey}
                            />

                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            {sunFilters.map((option) => {
                                const isSelected = selectedSun === option;

                                return (
                                    <Pressable
                                        key={option}
                                        onPress={() =>
                                            setSun((prev) => (prev === option ? null : option))
                                        }
                                        style={isSelected ? styles.selectedFilterContainer : styles.unSelectedfilterContainer}
                                    >
                                        <Text style={isSelected ? styles.selectedFilterText : styles.unSelectedFilterText}>{option}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <View style={styles.iconAndTitle}>
                            <Text style={styles.sheetTitle}>Plant Moisture</Text>
                            <Pressable onPress={() => openModalWithKey('Plant Moisture')}>
                                <FontAwesome5 name="question-circle" size={16} color="black" />
                            </Pressable>
                            <FilterInfoModal
                                visible={modalVisible}
                                onClose={() => setModalVisible(false)}
                                filterKey={activeKey}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', }}>
                            {moistureFilters.map((option) => {
                                const isSelected = selectedMoisture === option;

                                return (
                                    <Pressable
                                        key={option}
                                        onPress={() =>
                                            setMoisture((prev) => (prev === option ? null : option))
                                        }
                                        style={isSelected ? styles.selectedFilterContainer : styles.unSelectedfilterContainer}
                                    >
                                        <Text style={isSelected ? styles.selectedFilterText : styles.unSelectedFilterText}>{option}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Pressable onPress={closeSheet} style={styles.applyPressable}>
                            <View style={styles.applyContainer}>
                                <Text style={styles.applyText}>Apply</Text>
                            </View>
                        </Pressable>
                    </BottomSheetView>
                </BottomSheetModal>
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
        paddingBottom: 4,
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
        borderColor: 'black',
        color: '#111111',
        fontSize: 16,
        paddingHorizontal: 16,
        marginBottom: 0,
        flex: 1,
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
    heartIcon: {
        justifyContent: 'center',
        textAlign: 'center',
        paddingRight: 20
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 18,
    },
    filterIcon: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
    },
    applyText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 22

    },
    applyContainer: {
        backgroundColor: '#000000',
        borderRadius: 12,
        alignItems: 'center',
        width: 180,
        height: 40,
        justifyContent: 'center',
    },
    applyPressable: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    sheetContent: {
        flex: 1,
        padding: 22,
        paddingBottom: 64,
        paddingHorizontal: 15
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: 600,

    },
    unSelectedfilterContainer: {
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
        marginRight: 6,
        marginTop: 10,
        padding: 12,
        borderRadius: 8
    },
    selectedFilterContainer: {
        borderWidth: 1,
        borderColor: '#111111',
        backgroundColor: '#111111',
        flexDirection: 'row',
        marginRight: 6,
        marginTop: 10,
        padding: 12,
        borderRadius: 8,
    },
    unSelectedFilterText: {
        color: '#111111',
    },
    selectedFilterText: {
        color: '#ffffff',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    iconAndTitle: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 14,
        gap: 4

    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        padding: 20,
    },
    modalCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    modalBody: {
        fontSize: 14,
        lineHeight: 20,
        color: '#222',
    },
    modalCloseButton: {
        marginTop: 14,
        alignSelf: 'flex-end',
    },
    modalCloseText: {
        color: '#111',
        fontWeight: '600',
    },
});
