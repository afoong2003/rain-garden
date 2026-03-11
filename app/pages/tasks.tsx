import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppScaffold from '../components/AppScaffold';

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
        title: 'Check inlet for debris',
        details: 'Remove leaves and litter so stormwater can flow into the rain garden.',
        frequency: 'Daily',
        done: false,
    },
    {
        id: 't2',
        title: 'Inspect standing water',
        details: 'Verify water drains within 24-48 hours after rainfall.',
        frequency: 'Daily',
        done: false,
    },
    {
        id: 't3',
        title: 'Remove invasive weeds',
        details: 'Pull newly sprouted invasive species before they spread.',
        frequency: 'Weekly',
        done: false,
    },
    {
        id: 't4',
        title: 'Check mulch depth',
        details: 'Maintain mulch at ~2-3 inches and keep away from plant crowns.',
        frequency: 'Weekly',
        done: true,
    },
];

export default function TasksPage() {
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
        <AppScaffold title="Maintenance Tasks">
            <View style={styles.page}>
                <ScrollView contentContainerStyle={styles.pageContent}>
                    <Text style={styles.title}>Rain Garden Maintenance</Text>
                    <Text style={styles.subtitle}>Track daily and weekly tasks to keep your garden healthy.</Text>

                    {tasks.map((task) => (
                        <Pressable key={task.id} onPress={() => toggleTask(task.id)}>
                            <View style={styles.taskCard}>
                                <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
                                    {task.done ? <Text style={styles.checkmark}>✓</Text> : null}
                                </View>

                                <View style={styles.taskBody}>
                                    <View style={styles.taskHeaderRow}>
                                        <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>{task.title}</Text>
                                        <View style={styles.frequencyBadge}>
                                            <Text style={styles.frequencyText}>{task.frequency}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.taskDetails}>{task.details}</Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}

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
        lineHeight: 22,
        marginBottom: 16,
    },
    taskCard: {
        flexDirection: 'row',
        borderRadius: 14,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d4d4d4',
        padding: 14,
        marginBottom: 12,
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
    },
    taskHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
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
