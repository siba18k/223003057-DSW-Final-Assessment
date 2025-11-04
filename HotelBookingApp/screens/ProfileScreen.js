import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [userBookings, setUserBookings] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setEditedName(user.displayName || '');
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserBookings(userData.bookings || []);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout');
                        }
                    }
                }
            ]
        );
    };

    const handleUpdateProfile = async () => {
        if (!editedName.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                displayName: editedName.trim()
            });
            setShowEditModal(false);
            Alert.alert('Success', 'Profile updated successfully');

        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderBookingItem = ({ item }) => (
        <View style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
                <Text style={styles.hotelName}>{item.hotelName}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'confirmed' ? '#4CAF50' : '#FF9800' }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.bookingLocation}>{item.hotelLocation}</Text>
            </View>

            <View style={styles.bookingDetails}>
                <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color="#007AFF" />
                    <Text style={styles.detailText}>
                        {formatDate(item.checkInDate)} - {formatDate(item.checkOutDate)}
                    </Text>
                </View>

                <View style={styles.detailItem}>
                    <Ionicons name="bed-outline" size={16} color="#007AFF" />
                    <Text style={styles.detailText}>{item.numberOfRooms} Room(s)</Text>
                </View>

                <View style={styles.detailItem}>
                    <Ionicons name="card-outline" size={16} color="#007AFF" />
                    <Text style={styles.detailText}>${item.totalCost}</Text>
                </View>
            </View>

            <Text style={styles.bookingDate}>
                Booked on {formatDate(item.bookingDate)}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    <View style={styles.profileIcon}>
                        <Ionicons name="person" size={40} color="#007AFF" />
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
                        <Text style={styles.userEmail}>{user?.email}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setShowEditModal(true)}
                    >
                        <Ionicons name="pencil-outline" size={20} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My Bookings</Text>
                        <Text style={styles.bookingCount}>({userBookings.length})</Text>
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading bookings...</Text>
                        </View>
                    ) : userBookings.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-outline" size={64} color="#CCC" />
                            <Text style={styles.emptyText}>No bookings yet</Text>
                            <Text style={styles.emptySubtext}>Start exploring hotels to make your first booking</Text>
                            <TouchableOpacity
                                style={styles.exploreButton}
                                onPress={() => navigation.navigate('Explore')}
                            >
                                <Text style={styles.exploreButtonText}>Explore Hotels</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={userBookings}
                            renderItem={renderBookingItem}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            contentContainerStyle={styles.bookingsList}
                        />
                    )}
                </View>

                <View style={styles.actionSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                visible={showEditModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowEditModal(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowEditModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        <TouchableOpacity onPress={handleUpdateProfile}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={editedName}
                                onChangeText={setEditedName}
                                placeholder="Enter your full name"
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={user?.email}
                                editable={false}
                            />
                            <Text style={styles.helperText}>Email cannot be changed</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 20,
        borderRadius: 16,
        marginBottom: 32,
    },
    profileIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    editButton: {
        padding: 8,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    bookingCount: {
        fontSize: 16,
        color: '#666',
        marginLeft: 8,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
    exploreButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
        marginTop: 20,
    },
    exploreButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    bookingsList: {
        gap: 16,
    },
    bookingCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        padding: 16,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    hotelName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    bookingLocation: {
        marginLeft: 4,
        fontSize: 14,
        color: '#666',
    },
    bookingDetails: {
        gap: 8,
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
    },
    bookingDate: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    actionSection: {
        marginBottom: 40,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#FFEBEE',
    },
    logoutText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    cancelText: {
        fontSize: 16,
        color: '#007AFF',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    saveText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 15,
        fontSize: 16,
        backgroundColor: '#F9F9F9',
    },
    disabledInput: {
        backgroundColor: '#F0F0F0',
        color: '#999',
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});

export default ProfileScreen;
