import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const HotelDetailScreen = ({ navigation, route }) => {
    const { hotel } = route.params;
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [weather, setWeather] = useState(null);

    const sampleReviews = [
        {
            id: 1,
            userName: 'John Smith',
            rating: 5,
            text: 'Amazing hotel with excellent service!',
            date: '2024-10-15'
        },
        {
            id: 2,
            userName: 'Sarah Johnson',
            rating: 4,
            text: 'Great location and comfortable rooms.',
            date: '2024-10-10'
        }
    ];

    useEffect(() => {
        setReviews(sampleReviews);
        fetchWeatherForLocation();
    }, []);

    const fetchWeatherForLocation = async () => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${hotel.location}&appid=demo_key&units=metric`
            );
            if (response.ok) {
                const data = await response.json();
                setWeather(data);
            }
        } catch (error) {
            console.log('Weather API not available');
        }
    };

    const handleBookNow = () => {
        if (!user) {
            Alert.alert(
                'Sign In Required',
                'Please sign in to book a hotel.',
                [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
            );
            return;
        }
        navigation.navigate('Booking', { hotel });
    };

    const handleAddReview = () => {
        if (!user) {
            Alert.alert('Sign In Required', 'Please sign in to add a review.');
            return;
        }

        if (userReview) {
            Alert.alert('Review Exists', 'You have already reviewed this hotel.');
            return;
        }

        setShowReviewModal(true);
    };

    const submitReview = () => {
        if (!reviewText.trim()) {
            Alert.alert('Error', 'Please enter your review.');
            return;
        }

        const newReview = {
            id: Date.now(),
            userName: user.displayName,
            rating: reviewRating,
            text: reviewText,
            date: new Date().toISOString().split('T')[0]
        };

        setReviews([newReview, ...reviews]);
        setUserReview(newReview);
        setShowReviewModal(false);
        setReviewText('');
        setReviewRating(5);
        Alert.alert('Success', 'Thank you for your review!');
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Ionicons
                key={index}
                name={index < rating ? 'star' : 'star-outline'}
                size={16}
                color="#FFD700"
            />
        ));
    };

    const renderRatingStars = (rating, onPress) => {
        return Array.from({ length: 5 }, (_, index) => (
            <TouchableOpacity key={index} onPress={() => onPress(index + 1)}>
                <Ionicons
                    name={index < rating ? 'star' : 'star-outline'}
                    size={32}
                    color="#FFD700"
                />
            </TouchableOpacity>
        ));
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
                <Text style={styles.headerTitle}>Hotel Details</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: hotel.image }} style={styles.heroImage} />

                <View style={styles.content}>
                    <View style={styles.hotelHeader}>
                        <Text style={styles.hotelName}>{hotel.name}</Text>
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-outline" size={20} color="#666" />
                            <Text style={styles.location}>{hotel.location}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <View style={styles.stars}>
                                {renderStars(Math.floor(hotel.rating))}
                            </View>
                            <Text style={styles.ratingText}>{hotel.rating} ({reviews.length} reviews)</Text>
                        </View>
                    </View>

                    {weather && (
                        <View style={styles.weatherContainer}>
                            <Ionicons name="sunny-outline" size={24} color="#007AFF" />
                            <View>
                                <Text style={styles.weatherTemp}>{Math.round(weather.main?.temp)}°C</Text>
                                <Text style={styles.weatherDesc}>{weather.weather?.[0]?.description}</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{hotel.description}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Amenities</Text>
                        <View style={styles.amenitiesContainer}>
                            {hotel.amenities.map((amenity, index) => (
                                <View key={index} style={styles.amenityItem}>
                                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                    <Text style={styles.amenityText}>{amenity}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.reviewsHeader}>
                            <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
                            <TouchableOpacity
                                style={styles.addReviewButton}
                                onPress={handleAddReview}
                            >
                                <Text style={styles.addReviewText}>Add Review</Text>
                            </TouchableOpacity>
                        </View>

                        {reviews.length === 0 ? (
                            <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
                        ) : (
                            reviews.map((review) => (
                                <View key={review.id} style={styles.reviewItem}>
                                    <View style={styles.reviewHeader}>
                                        <Text style={styles.reviewerName}>{review.userName}</Text>
                                        <View style={styles.reviewStars}>
                                            {renderStars(review.rating)}
                                        </View>
                                    </View>
                                    <Text style={styles.reviewText}>{review.text}</Text>
                                    <Text style={styles.reviewDate}>{review.date}</Text>
                                </View>
                            ))
                        )}
                    </View>

                    <View style={styles.priceSection}>
                        <View>
                            <Text style={styles.priceLabel}>Price per night</Text>
                            <Text style={styles.price}>${hotel.price}</Text>
                        </View>
                        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
                            <Text style={styles.bookButtonText}>Book Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={showReviewModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowReviewModal(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Add Review</Text>
                        <TouchableOpacity onPress={submitReview}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>
                        <Text style={styles.ratingLabel}>Rating</Text>
                        <View style={styles.ratingSelector}>
                            {renderRatingStars(reviewRating, setReviewRating)}
                        </View>

                        <Text style={styles.reviewLabel}>Your Review</Text>
                        <TextInput
                            style={styles.reviewInput}
                            multiline
                            numberOfLines={6}
                            placeholder="Share your experience..."
                            value={reviewText}
                            onChangeText={setReviewText}
                            textAlignVertical="top"
                        />
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
    heroImage: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 20,
    },
    hotelHeader: {
        marginBottom: 24,
    },
    hotelName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    location: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
    },
    weatherContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    weatherTemp: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginLeft: 12,
    },
    weatherDesc: {
        fontSize: 14,
        color: '#666',
        marginLeft: 12,
        textTransform: 'capitalize',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    amenitiesContainer: {
        gap: 12,
    },
    amenityItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amenityText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addReviewButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addReviewText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    noReviewsText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    reviewItem: {
        backgroundColor: '#F9F9F9',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    reviewStars: {
        flexDirection: 'row',
    },
    reviewText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: '#999',
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 20,
        borderRadius: 16,
        marginTop: 20,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    bookButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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
    submitText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    ratingLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    ratingSelector: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 32,
    },
    reviewLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    reviewInput: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        minHeight: 120,
        backgroundColor: '#F9F9F9',
    },
});

export default HotelDetailScreen;
