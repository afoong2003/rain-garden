import { usePathname, useRouter, type Href } from 'expo-router';
import { ReactNode, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppScaffoldProps {
    title: string;
    children: ReactNode;
};

const menuItems: Array<{ key: string; label: string; href: Href }> = [
    { key: 'MyRainGardens', label: 'My Rain Gardens', href: '/homepage/myRainGardens' },
    { key: 'plants', label: 'Plant Database', href: '/plant_db/plants' },
    { key: 'tasks', label: 'Maintenance Tasks', href: '/pages/tasks' },
    { key: 'survey', label: 'Survey', href: '/' },
    { key: 'rebates', label: 'Rebates', href: '/pages/rebates' },
    { key: 'RainGardenDesigner', label: 'Rain Garden Designer', href: '/rain_garden_design/templateList' }



];

export default function AppScaffold({ title, children }: AppScaffoldProps) {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const goTo = (href: Href) => {
        const currentPath = pathname.replace(/\/+$/, '') || '/';
        const targetPath = String(href).replace(/\/+$/, '') || '/';

        if (currentPath === targetPath) {
            setIsMenuOpen(false);
            return;
        }

        setIsMenuOpen(false);
        router.replace(href);
    };

    return (
        <View style={styles.safeArea}>
            <SafeAreaView edges={['bottom']} style={styles.safeAreaContent}>
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <View style={styles.headerRow}>
                        <Pressable style={styles.menuButton} onPress={() => setIsMenuOpen(true)}>
                            <Text style={styles.menuIcon}>☰</Text>
                        </Pressable>
                        <Text style={styles.headerTitle}>{title}</Text>
                        <View style={styles.headerSpacer} />
                    </View>
                </View>

                <View style={styles.content}>{children}</View>
            </SafeAreaView>

            <Modal visible={isMenuOpen} transparent animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
                <View style={styles.modalRoot}>
                    <View
                        style={[
                            styles.drawer,
                            {
                                paddingTop: insets.top + 24,
                                paddingBottom: insets.bottom + 16,
                            },
                        ]}
                    >
                        <Text style={styles.drawerTitle}>Rain Garden</Text>
                        {menuItems.map((item) => (
                            <Pressable key={item.key} style={styles.drawerItem} onPress={() => goTo(item.href)}>
                                <Text style={styles.drawerItemText}>{item.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <Pressable style={styles.backdrop} onPress={() => setIsMenuOpen(false)} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    safeAreaContent: {
        flex: 1,
    },
    header: {
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        paddingHorizontal: 12,
    },
    headerRow: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        color: '#111111',
        fontSize: 30,
        fontWeight: '700',
    },
    headerTitle: {
        color: '#111111',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    headerSpacer: {
        width: 36,
    },
    content: {
        flex: 1,
    },
    modalRoot: {
        flex: 1,
        flexDirection: 'row',
    },
    drawer: {
        width: 260,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
    },
    drawerTitle: {
        color: '#111111',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 22,
    },
    drawerItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    drawerItemText: {
        color: '#1a1a1a',
        fontSize: 16,
        fontWeight: '600',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});
