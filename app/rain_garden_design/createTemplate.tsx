import { Pressable, StyleSheet, View, Text, ScrollView, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image as ExpoImage } from 'expo-image'
import { useRouter } from 'expo-router';



interface templatePlants {
    plant_id: number;
}

interface maintTask {
    task_id: number;
    title: string;
}

interface gardenTemplate {
    id: number;
    title: string;
    plants: templatePlants[]
    tasks: maintTask[]
}

interface apiPlant {
    plant_id: number;
    display_name: string;
    scientific_name: string;
    image: string;
    min_space: number;
    max_space: number;
}



function find_amount_of_plants(total_area: number) {
    let total_area_used = 0;

}


const STORAGE_KEY = '@garden_templates';

export default function createTemplate() {

    const [templateTitle, setTemplateTitle] = useState<string>('')
    const [plantList, setPlantList] = useState<templatePlants[]>([])
    const [areaSqFt, setAreaSqFt] = useState<number>()
    const [shape, setShape] = useState('')
    const [zone, setZone] = useState('Base')
    const [plantSearch, setPlantSearch] = useState('')
    const [plantData, setPlantData] = useState<apiPlant[]>([])
    const router = useRouter();

    useEffect(() => {
        applyFilter('Base');
    }, []);


    async function applyFilter(zone: string) {
        try {

            const filter: Record<string, boolean> = {}

            if (zone === 'Base') {
                filter["pos_base"] = true
            } else if (zone === 'Slope') {
                filter["pos_slope"] = true
            } else if (zone === 'Margin') {
                filter["pos_margin"] = true
            }

            const response = await fetch('http://0.0.0.0:8000/plants/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filter)
            });

            const filtered_plants: apiPlant[] = await response.json();

            setPlantData(filtered_plants)

        } catch (e) {
            console.log(e)
        }
    }


    async function saveTemplate(templateName: string, templateArea: number, list: templatePlants[]) {

    }

    function addPlant(plant_id: number) {

    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </Pressable>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.title}>CREATE TEMPLATE</Text>
                    </View>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.box}>
                    <Text>TEMPLATE NAME</Text>
                    <View style={styles.searchRow}>
                        <TextInput
                            value={templateTitle}
                            onChangeText={setTemplateTitle}
                            placeholder=""
                            placeholderTextColor="#888888"
                            selectionColor="black"
                            style={styles.searchInput}
                        />
                    </View>
                    <Text>TOTAL SQUARE FEET</Text>
                    <View style={styles.searchRow}>
                        <TextInput
                            value={areaSqFt?.toString() || ''}
                            onChangeText={(text) => {
                                const numericValue = text === '' ? undefined : Number(text);
                                if (!isNaN(numericValue as number) || text === '') {
                                    setAreaSqFt(numericValue);
                                }
                            }}
                            keyboardType="numeric"
                            placeholder=""
                            placeholderTextColor="#888888"
                            selectionColor="black"
                            style={styles.searchInput}
                        />
                    </View>
                </View>

                <Text style={styles.title2}>CHOOSE SHAPE</Text>
                <View style={styles.box}>
                    <Text>BEAN</Text>

                </View>

                <Text style={styles.title2}>Native Chicago Plants</Text>
                <View style={styles.zonePill}>
                    {['Base', 'Slope', 'Margin'].map((zoneString) => (
                        <Pressable
                            key={zoneString}
                            onPress={() => {
                                setZone(zoneString);
                                applyFilter(zoneString);
                            }}
                            style={{
                                backgroundColor: zone === zoneString ? '#000000' : 'transparent',
                                borderRadius: 16,
                                padding: 8,
                                width: '33%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{
                                color: zone === zoneString ? 'white' : 'black',
                                fontWeight: 'bold'
                            }}>
                                {zoneString}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialIcons name="search" size={24} color="black" />
                    <TextInput
                        value={plantSearch}
                        onChangeText={setPlantSearch}
                        placeholder={`Search plants within ${zone}`}
                        placeholderTextColor="#888888"
                        selectionColor="black"
                        style={styles.searchInput2}
                    />
                </View>

                <View style={{
                    height: (60 + 8) * 5,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 16,
                    marginBottom: 6
                }}>
                    <FlatList
                        data={plantData}
                        keyExtractor={(item) => item.plant_id.toString()}

                        nestedScrollEnabled={true}

                        showsVerticalScrollIndicator={true}
                        renderItem={({ item }) => (
                            <View style={[styles.box2, {
                                height: 60,
                                marginBottom: 8,
                                justifyContent: 'center',
                                paddingVertical: 0,
                                padding: 12
                            }]}>
                                <ExpoImage
                                    source={{ uri: item.image }}
                                    style={styles.cardImage}
                                    contentFit='cover'
                                    transition={120}
                                />

                                <Text>{item.display_name}</Text>
                                <Text>{item.scientific_name}</Text>
                                <Pressable>
                                    <Ionicons name="add" size={24} color="black" />
                                </Pressable>
                            </View>
                        )}
                    />
                </View>
                <View>
                    <Text style={styles.title2}>MAINTENANCE TASKS</Text>
                </View>



                <View style={styles.saveButton}>
                    <Text style={styles.buttonText}>SAVE TEMPLATE</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 24,
        paddingTop: 10
    },
    searchInput: {
        height: 48,
        borderRadius: 28,
        backgroundColor: '#f5f5f5',
        borderColor: 'black',
        color: '#111111',
        fontSize: 16,
        paddingHorizontal: 16,
        marginBottom: 0,
        flex: 1,
    },
    searchInput2: {
        height: '100%',
        borderRadius: 28,
        borderColor: 'black',
        color: '#111111',
        fontSize: 16,
        paddingHorizontal: 16,
        marginBottom: 0,
        flex: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderRadius: 28,
        backgroundColor: '#e8e8e8',
        borderColor: '#dddddd',
        paddingHorizontal: 12,
        marginBottom: 18,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 18,
    },
    box: {
        borderRadius: 16,
        backgroundColor: '#ffffff',
        padding: 18

    },
    box2: {
        borderRadius: 24,
        backgroundColor: '#ffffff',
        padding: 32,
        flexDirection: 'row'

    },
    title: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 22,
        marginBottom: 14,
        marginTop: 14,

    },
    title2: {
        textAlign: 'left',
        fontWeight: '500',
        fontSize: 22,
        marginBottom: 14,
        marginTop: 14
    },
    zonePill: {
        borderRadius: 24,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 12,
        marginBottom: 14
    },
    saveButton: {
        borderRadius: 24,
        backgroundColor: '#000000',
        alignItems: 'center',
        height: 40,
        justifyContent: 'center'

    },
    buttonText: {
        color: '#ffffff',
        fontSize: 20,
        textAlign: 'center'

    },
    cardImage: {
        width: 50,
        height: 50,
        borderRadius: 32
    },
    backButton: {
        minWidth: 44,
        minHeight: 44,
        justifyContent: 'center',
    },




});