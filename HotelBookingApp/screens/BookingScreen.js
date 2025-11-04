import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';

const BookingScreen = ({ navigation, route }) => {
    const { hotel } = route.params;
    const { user } = useAuth();
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
    const [numberOfRooms, setNumberOfRooms] = useState(1);
    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const calculateTotalCost = () => {
        const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        return daysDifference * hotel.price * numberOfRooms;
    };

    const calculateDays = () => {
        const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
        return Math.ceil(timeDifference / (1000 * 3600 * 24));
    };

    const validateBooking = () => {
        if (checkOutDate <= checkInDate) {
            Alert.alert('Invalid Dates', 'Check-out date must be after check-in date');
            return false;
        }

        if (checkInDate < new Date().setHours(0, 0, 0, 0)) {
            Alert.alert('Invalid Date', 'Check-in date cannot be in the past');
            return false;
        }

        return true;
    };

    const handleBooking = async () => {
        if (!validateBooking()) return;

        setIsLoading(true);
        try {
            const booking = {
                id: Date.now().toString(),
                hotelId: hotel.id,
                hotelName: hotel.name,
                hotelLocation: hotel.location,
                checkInDate: checkInDate.toISOString(),
                checkOutDate: checkOutDate.toISOString(),
                numberOfRooms,
                totalCost: calculateTotalCost(),
                bookingDate: new Date().toISOString(),
                status: 'confirmed'
            };

            await updateDoc(doc(db, 'users', user.uid), {
                bookings: arrayUnion(booking)
            });

            navigation.navigate('BookingSuccess', { booking, hotel });
        } catch (error) {
            Alert.alert('Booking Error', 'Failed to create booking. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const onCheckInDateChange = (event, selectedDate) => {
        setShowCheckInPicker(false);
        if (selectedDate) {
            setCheckInDate(selectedDate);
            if (selectedDate >= checkOutDate) {
                setCheckOutDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
            }
        }
    };

    const onCheckOutDateChange = (event, selectedDate) => {
        setShowCheckOutPicker(false);
        if (selectedDate) {
            setCheckOutDate(selectedDate);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book Your Stay</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.hotelSummary}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    <Text style={styles.hotelLocation}>{hotel.location}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Check-in Date</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowCheckInPicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                        <Text style={styles.dateText}>{formatDate(checkInDate)}</Text>
                        <Ionicons name="chevron-down-outline" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Check-out Date</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowCheckOutPicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                        <Text style={styles.dateText}>{formatDate(checkOutDate)}</Text>
                        <Ionicons name="chevron-down-outline" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Number of Rooms</Text>
                    <View style={styles.roomSelector}>
                        <TouchableOpacity
                            style={styles.roomButton}
                            onPress={() => setNumberOfRooms(Math.max(1, numberOfRooms - 1))}
                            disabled={numberOfRooms <= 1}
                        >
                            <Ionicons name="remove" size={20} color={numberOfRooms <= 1 ? "#CCC" : "#007AFF"} />
                        </TouchableOpacity>
                        <Text style={styles.roomCount}>{numberOfRooms}</Text>
                        <TouchableOpacity
                            style={styles.roomButton}
                            onPress={() => setNumberOfRooms(numberOfRooms + 1)}
                        >
                            <Ionicons name="add" size={20} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Booking Summary</Text>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Dates</Text>
                        <Text style={styles.summaryValue}>
                            {formatDate(checkInDate)} - {formatDate(checkOutDate)}
                        </Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Nights</Text>
                        <Text style={styles.summaryValue}>{calculateDays()}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Rooms</Text>
                        <Text style={styles.summaryValue}>{numberOfRooms}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Price per night</Text>
                        <Text style={styles.summaryValue}>${hotel.price}</Text>
                    </View>

                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total Cost</Text>
                        <Text style={styles.totalValue}>${calculateTotalCost()}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.bookButton, isLoading && styles.disabledButton]}
                    onPress={handleBooking}
                    disabled={isLoading}
                >
                    <Text style={styles.bookButtonText}>
                        {isLoading ? 'Processing...' : 'Confirm Booking'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {showCheckInPicker && (
                <DateTimePicker
                    value={checkInDate}
                    mode="date"
                    display="default"
                    onChange={onCheckInDateChange}
                    minimumDate={new Date()}
                />
            )}

            {showCheckOutPicker && (
                <DateTimePicker
                    value={checkOutDate}
                    mode="date"
                    display="default"
                    onChange={onCheckOutDateChange}
                    minimumDate={new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)}
                />
            )}
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
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    hotelSummary: {
        backgroundColor: '#F9F9F9',
        padding: 20,
        borderRadius: 16,
        marginBottom: 32,
    },
    hotelName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    hotelLocation: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    dateText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    roomSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9F9F9',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    roomButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    roomCount: {
        marginHorizontal: 30,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    summarySection: {
        backgroundColor: '#F9F9F9',
        padding: 20,
        borderRadius: 16,
        marginBottom: 32,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
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
        color: '#007AFF',
    },
    bookButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 40,
    },
    disabledButton: {
        backgroundColor: '#B0B0B0',
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default BookingScreen;
