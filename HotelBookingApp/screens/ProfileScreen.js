import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && user.uid && database) {
            fetchUserBookings();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchUserBookings = async () => {
        if (!user || !user.uid || !database) {
            setBookings([]);
            setIsLoading(false);
            return;
        }

        try {
            const bookingsRef = ref(database, `hotelBookings/${user.uid}`);
            const snapshot = await get(bookingsRef);

            if (snapshot.exists()) {
                const bookingsData = snapshot.val();
                const bookingsArray = Object.keys(bookingsData).map(key => ({
                    ...bookingsData[key],
                    id: key
                }));
                setBookings(bookingsArray.reverse());
            } else {
                setBookings([]);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookings([]);
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
                { text: 'Logout', style: 'destructive', onPress: () => logout() }
            ]
        );
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const renderBookingCard = (booking) => (
        <View key={booking.id} style={styles.bookingCard}>
            <Image source={{ uri: booking.hotelImage }} style={styles.bookingImage} />
            <View style={styles.bookingInfo}>
                <Text style={styles.bookingHotelName}>{booking.hotelName || 'Unknown Hotel'}</Text>
                <View style={styles.bookingDates}>
                    <Text style={styles.bookingDateText}>
                        📅 {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                    </Text>
                </View>
                <View style={styles.bookingDetails}>
                    <Text style={styles.bookingDetailText}>
                        {booking.nights || 1} night{(booking.nights || 1) > 1 ? 's' : ''} • {booking.guests || 1} guest{(booking.guests || 1) > 1 ? 's' : ''}
                    </Text>
                    <Text style={styles.bookingAmount}>${(booking.totalAmount || 0).toFixed(2)}</Text>
                </View>
                <View style={styles.bookingStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                        <Text style={styles.statusText}>
                            {(booking.status || 'pending').charAt(0).toUpperCase() + (booking.status || 'pending').slice(1)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#28A745';
            case 'pending': return '#FFC107';
            case 'cancelled': return '#DC3545';
            default: return '#6C757D';
        }
    };

    // Early return if user is not loaded
    if (!user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading user data...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.profileInfo}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                            </Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
                            <Text style={styles.userEmail}>{user?.email || ''}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{bookings.length}</Text>
                        <Text style={styles.statLabel}>Total Bookings</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                            {bookings.filter(b => b.status === 'confirmed').length}
                        </Text>
                        <Text style={styles.statLabel}>Confirmed</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                            ${bookings.reduce((total, booking) => total + (booking.totalAmount || 0), 0).toFixed(0)}
                        </Text>
                        <Text style={styles.statLabel}>Total Spent</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Bookings</Text>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007AFF" />
                            <Text style={styles.loadingText}>Loading bookings...</Text>
                        </View>
                    ) : bookings.length > 0 ? (
                        <View style={styles.bookingsContainer}>
                            {bookings.map(renderBookingCard)}
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>📅</Text>
                            <Text style={styles.emptyText}>No bookings yet</Text>
                            <Text style={styles.emptySubtext}>Start exploring and book your first hotel!</Text>
                            <TouchableOpacity
                                style={styles.exploreButton}
                                onPress={() => navigation.navigate('Explore')}
                            >
                                <Text style={styles.exploreButtonText}>Explore Hotels</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <Text style={styles.menuIcon}>👤</Text>
                                <Text style={styles.menuItemText}>Edit Profile</Text>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <Text style={styles.menuIcon}>🔔</Text>
                                <Text style={styles.menuItemText}>Notifications</Text>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <Text style={styles.menuIcon}>❓</Text>
                                <Text style={styles.menuItemText}>Help & Support</Text>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <Text style={styles.menuIcon}>⚙️</Text>
                                <Text style={styles.menuItemText}>Settings</Text>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                            <View style={styles.menuItemLeft}>
                                <Text style={styles.menuIcon}>🚪</Text>
                                <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        backgroundColor: '#F8F9FA',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginVertical: 16,
        paddingVertical: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E5E5E5',
        marginVertical: 8,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    bookingsContainer: {
        gap: 16,
    },
    bookingCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        flexDirection: 'row',
    },
    bookingImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 16,
    },
    bookingInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    bookingHotelName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    bookingDates: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    bookingDateText: {
        fontSize: 12,
        color: '#666',
    },
    bookingDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    bookingDetailText: {
        fontSize: 12,
        color: '#666',
    },
    bookingAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    bookingStatus: {
        alignItems: 'flex-start',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        color: 'white',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginBottom: 24,
    },
    exploreButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    exploreButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
    chevron: {
        fontSize: 20,
        color: '#CCC',
    },
    logoutItem: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    logoutText: {
        color: '#DC3545',
    },
});

export default ProfileScreen;
