import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BookingSuccessScreen = ({ route, navigation }) => {
    const { booking, hotel } = route.params;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleGoHome = () => {
        navigation.navigate('MainTabs', { screen: 'Explore' });
    };

    const handleViewBookings = () => {
        navigation.navigate('MainTabs', { screen: 'Profile' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.successIcon}>
                    <Ionicons name="checkmark-circle" size={80} color="#28A745" />
                </View>

                <Text style={styles.title}>Booking Confirmed!</Text>
                <Text style={styles.subtitle}>
                    Your reservation has been successfully confirmed. You'll receive a confirmation email shortly.
                </Text>

                <View style={styles.bookingCard}>
                    <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                    <View style={styles.bookingDetails}>
                        <Text style={styles.hotelName}>{hotel.name}</Text>
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={14} color="#666" />
                            <Text style={styles.location}>{hotel.location}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="calendar-outline" size={16} color="#007AFF" />
                            <Text style={styles.detailText}>
                                {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="time-outline" size={16} color="#007AFF" />
                            <Text style={styles.detailText}>{booking.nights} night{booking.nights > 1 ? 's' : ''}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Ionicons name="people-outline" size={16} color="#007AFF" />
                            <Text style={styles.detailText}>
                                {booking.guests} guest{booking.guests > 1 ? 's' : ''}, {booking.rooms} room{booking.rooms > 1 ? 's' : ''}
                            </Text>
                        </View>

                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalAmount}>${booking.totalAmount.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bookingInfo}>
                    <Text style={styles.bookingId}>Booking ID: {booking.id}</Text>
                    <Text style={styles.bookingStatus}>Status: Confirmed</Text>
                </View>
            </View>

            <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleViewBookings}>
                    <Text style={styles.secondaryButtonText}>View My Bookings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
                    <Text style={styles.primaryButtonText}>Continue Exploring</Text>
                </TouchableOpacity>
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
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successIcon: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    bookingCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        padding: 16,
        width: '100%',
        marginBottom: 24,
    },
    hotelImage: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        marginBottom: 16,
    },
    bookingDetails: {
        gap: 8,
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
        marginBottom: 12,
    },
    location: {
        marginLeft: 4,
        fontSize: 14,
        color: '#666',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    bookingInfo: {
        alignItems: 'center',
        gap: 4,
    },
    bookingId: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'monospace',
    },
    bookingStatus: {
        fontSize: 14,
        color: '#28A745',
        fontWeight: '500',
    },
    bottomButtons: {
        padding: 20,
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white',
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
