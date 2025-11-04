import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, push } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const BookingScreen = ({ route, navigation }) => {
    const { hotel } = route.params;
    const { user } = useAuth();
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
    const [guests, setGuests] = useState(1);
    const [rooms, setRooms] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const calculateNights = () => {
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    };

    const calculateTotal = () => {
        const nights = calculateNights();
        const roomTotal = hotel.price * rooms * nights;
        const tax = roomTotal * 0.1;
        return {
            subtotal: roomTotal,
            tax: tax,
            total: roomTotal + tax
        };
    };

    const handleBooking = async () => {
        if (checkInDate >= checkOutDate) {
            Alert.alert('Error', 'Check-out date must be after check-in date');
            return;
        }

        setIsLoading(true);
        try {
            const booking = {
                id: Date.now().toString(),
                hotelId: hotel.id,
                hotelName: hotel.name,
                hotelImage: hotel.image,
                checkInDate: checkInDate.toISOString(),
                checkOutDate: checkOutDate.toISOString(),
                guests,
                rooms,
                nights: calculateNights(),
                totalAmount: calculateTotal().total,
                status: 'confirmed',
                bookingDate: new Date().toISOString()
            };

            // Save booking to separate hotelBookings path to avoid conflicts
            const bookingsRef = ref(database, `hotelBookings/${user.uid}`);
            await push(bookingsRef, booking);

            navigation.navigate('BookingSuccess', { booking, hotel });
        } catch (error) {
            Alert.alert('Booking Failed', 'Something went wrong. Please try again.');
            console.error('Booking error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (dateString, isCheckIn) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return;

        if (isCheckIn) {
            setCheckInDate(date);
            if (date >= checkOutDate) {
                setCheckOutDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
            }
        } else {
            if (date > checkInDate) {
                setCheckOutDate(date);
            }
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateForInput = (date) => {
        return date.toISOString().split('T')[0];
    };

    const pricing = calculateTotal();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book Hotel</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.hotelInfo}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    <View style={styles.locationContainer}>
                        <Text style={styles.location}>📍 {hotel.location}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dates</Text>
                    <View style={styles.dateContainer}>
                        <View style={styles.dateInputContainer}>
                            <Text style={styles.dateLabel}>Check-in</Text>
                            <TextInput
                                style={styles.dateInput}
                                value={formatDateForInput(checkInDate)}
                                onChangeText={(text) => handleDateChange(text, true)}
                                placeholder="YYYY-MM-DD"
                            />
                            <Text style={styles.dateDisplay}>{formatDate(checkInDate)}</Text>
                        </View>
                        <View style={styles.dateSeparator}>
                            <Text style={styles.arrowText}>→</Text>
                        </View>
                        <View style={styles.dateInputContainer}>
                            <Text style={styles.dateLabel}>Check-out</Text>
                            <TextInput
                                style={styles.dateInput}
                                value={formatDateForInput(checkOutDate)}
                                onChangeText={(text) => handleDateChange(text, false)}
                                placeholder="YYYY-MM-DD"
                            />
                            <Text style={styles.dateDisplay}>{formatDate(checkOutDate)}</Text>
                        </View>
                    </View>
                    <Text style={styles.nightsText}>{calculateNights()} nights</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Guests & Rooms</Text>
                    <View style={styles.counterContainer}>
                        <View style={styles.counterItem}>
                            <Text style={styles.counterLabel}>Guests</Text>
                            <View style={styles.counter}>
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => setGuests(Math.max(1, guests - 1))}
                                >
                                    <Text style={styles.counterButtonText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.counterValue}>{guests}</Text>
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => setGuests(guests + 1)}
                                >
                                    <Text style={styles.counterButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.counterItem}>
                            <Text style={styles.counterLabel}>Rooms</Text>
                            <View style={styles.counter}>
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => setRooms(Math.max(1, rooms - 1))}
                                >
                                    <Text style={styles.counterButtonText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.counterValue}>{rooms}</Text>
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => setRooms(rooms + 1)}
                                >
                                    <Text style={styles.counterButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pricing Details</Text>
                    <View style={styles.pricingContainer}>
                        <View style={styles.pricingRow}>
                            <Text style={styles.pricingLabel}>
                                ${hotel.price} × {rooms} room{rooms > 1 ? 's' : ''} × {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
                            </Text>
                            <Text style={styles.pricingValue}>${pricing.subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.pricingRow}>
                            <Text style={styles.pricingLabel}>Taxes & fees</Text>
                            <Text style={styles.pricingValue}>${pricing.tax.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.pricingRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${pricing.total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.bottomTotalLabel}>Total</Text>
                    <Text style={styles.bottomTotalValue}>${pricing.total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={handleBooking}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.bookButtonText}>Confirm Booking</Text>
                    )}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        padding: 4,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    hotelInfo: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    hotelName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dateInputContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    dateSeparator: {
        paddingHorizontal: 16,
    },
    arrowText: {
        fontSize: 20,
        color: '#666',
    },
    dateLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    dateInput: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
        padding: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
        minWidth: 100,
    },
    dateDisplay: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    nightsText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    counterContainer: {
        gap: 20,
    },
    counterItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    counterLabel: {
        fontSize: 16,
        color: '#333',
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    counterButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterButtonText: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    counterValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        minWidth: 20,
        textAlign: 'center',
    },
    pricingContainer: {
        gap: 12,
    },
    pricingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pricingLabel: {
        fontSize: 14,
        color: '#666',
    },
    pricingValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    totalRow: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        backgroundColor: 'white',
    },
    totalContainer: {
        flex: 1,
    },
    bottomTotalLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    bottomTotalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    bookButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        marginLeft: 20,
    },
    bookButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default BookingScreen;
