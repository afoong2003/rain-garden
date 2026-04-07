import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import AppScaffold from '../components/AppScaffold';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


type Task = {
    id: string;
    title: string;
    details: string;
    frequency: 'Daily' | 'Weekly';
    done: boolean;
};

const initialTasks: Task[] = [
    {
        id: 't1',
        title: 'Clear debris from inlet',
        details: 'Remove leaves and litter so stormwater can flow into the rain garden.',
        frequency: 'Daily',
        done: false,
    },
    {
        id: 't2',
        title: 'Check for erosion',
        details: 'Verify water drains within 24-48 hours after rainfall.',
        frequency: 'Daily',
        done: false,
    },
    {
        id: 't3',
        title: 'Prune dead stems',
        details: 'Pull newly sprouted invasive species before they spread.',
        frequency: 'Weekly',
        done: false,
    },
];




export default function Home() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const toggleTask = (taskId: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        done: !task.done,
                    }
                    : task,
            ),
        );
    };

    return (
        <AppScaffold title="My Rain Gardens">
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <View style={styles.tempBox}>
                            <Text style={styles.text}>CURRENT ATMOSPHERE</Text>

                        </View>
                        <View style={styles.drainBox}>
                            <Text style={styles.text}>72HR DRAINAGE</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>Maintenance</Text>
                    {tasks.map((task) => (
                        <Pressable key={task.id} onPress={() => toggleTask(task.id)}>
                            <View style={styles.taskCard}>
                                <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
                                    {task.done ? <Text style={styles.checkmark}>✓</Text> : null}
                                </View>

                                <View style={styles.taskBody}>
                                    <View style={styles.taskHeaderRow}>
                                        <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>{task.title}</Text>
                                        <View>
                                            <FontAwesome5 name="question-circle" size={20} color="black" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                    <Text style={styles.title}>Journal</Text>
                </ScrollView>
                <StatusBar style="dark" />
            </View>
        </AppScaffold >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 22,
        paddingTop: 8,
    },
    tempBox: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        width: '62%',
        height: 140,
        borderColor: '#d4d4d4',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderWidth: 1,

    },
    drainBox: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        width: '35%',
        height: 140,
        borderColor: '#d4d4d4',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderWidth: 1,


    },
    text: {
        marginTop: 16,
        marginLeft: 16,
        fontWeight: 600

    },
    title: {
        color: '#111111',
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 10
    },
    taskCard: {
        flexDirection: 'row',
        borderRadius: 14,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        padding: 14,
        marginBottom: 12,
        borderColor: '#d4d4d4',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#999999',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checkboxDone: {
        backgroundColor: '#1a1a1a',
        borderColor: '#1a1a1a',
    },
    checkmark: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    taskBody: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    taskHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
        marginBottom: 0,
        gap: 10,
    },
    taskTitle: {
        color: '#111111',
        fontSize: 17,
        fontWeight: '700',
        flex: 1,
    },
    taskTitleDone: {
        color: '#888888',
        textDecorationLine: 'line-through',
    },
    frequencyBadge: {
        borderRadius: 999,
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    frequencyText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    taskDetails: {
        color: '#444444',
        fontSize: 14,
        lineHeight: 20,
    },

});
