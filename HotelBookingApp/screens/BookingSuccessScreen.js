import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const BookingSuccessScreen = ({ navigation, route }) => {
    const { booking, hotel } = route.params;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleGoHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    };

    const handleViewBookings = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs', params: { screen: 'Profile' } }],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.successIcon}>
                    <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                </View>

                <Text style={styles.successTitle}>Booking Confirmed!</Text>
                <Text style={styles.successSubtitle}>
                    Your reservation has been successfully created
                </Text>

                <View style={styles.bookingCard}>
                    <Text style={styles.bookingId}>Booking ID: #{booking.id}</Text>

                    <View style={styles.hotelInfo}>
                        <Text style={styles.hotelName}>{hotel.name}</Text>
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={16} color="#666" />
                            <Text style={styles.hotelLocation}>{hotel.location}</Text>
                        </View>
                    </View>

                    <View style={styles.bookingDetails}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Check-in</Text>
                            <Text style={styles.detailValue}>{formatDate(booking.checkInDate)}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Check-out</Text>
                            <Text style={styles.detailValue}>{formatDate(booking.checkOutDate)}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Rooms</Text>
                            <Text style={styles.detailValue}>{booking.numberOfRooms}</Text>
                        </View>

                        <View style={[styles.detailRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total Paid</Text>
                            <Text style={styles.totalValue}>${booking.totalCost}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.infoItem}>
                        <Ionicons name="mail-outline" size={24} color="#007AFF" />
                        <Text style={styles.infoText}>
                            Confirmation email sent to your registered email address
                        </Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Ionicons name="time-outline" size={24} color="#007AFF" />
                        <Text style={styles.infoText}>
                            Check-in time: 3:00 PM | Check-out time: 11:00 AM
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
                        <Text style={styles.primaryButtonText}>Explore More Hotels</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={handleViewBookings}>
                        <Text style={styles.secondaryButtonText}>View My Bookings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successIcon: {
        marginBottom: 32,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    bookingCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        marginBottom: 32,
    },
    bookingId: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    hotelInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    hotelName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hotelLocation: {
        marginLeft: 4,
        fontSize: 14,
        color: '#666',
    },
    bookingDetails: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    totalRow: {
        marginTop: 12,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    infoSection: {
        width: '100%',
        marginBottom: 40,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoText: {
        marginLeft: 16,
        fontSize: 14,
        color: '#666',
        flex: 1,
        lineHeight: 20,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default BookingSuccessScreen;
