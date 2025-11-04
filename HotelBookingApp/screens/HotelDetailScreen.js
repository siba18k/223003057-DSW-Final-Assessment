import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const HotelDetailScreen = ({ route, navigation }) => {
    const { hotel } = route.params;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const hotelImages = [
        hotel.image,
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400',
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % hotelImages.length
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const renderAmenity = (amenity, index) => (
        <View key={index} style={styles.amenityItem}>
            <Text style={styles.amenityIcon}>{getAmenityIcon(amenity)}</Text>
            <Text style={styles.amenityText}>{amenity}</Text>
        </View>
    );

    const getAmenityIcon = (amenity) => {
        const icons = {
            'WiFi': '📶',
            'Pool': '🏊',
            'Gym': '💪',
            'Restaurant': '🍽️',
            'Beach Access': '🏖️',
            'Spa': '🌸',
            'Fireplace': '🔥',
            'Skiing': '⛷️',
            'Business Center': '💼',
            'Parking': '🚗',
            'Bike Rental': '🚲'
        };
        return icons[amenity] || '✓';
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: hotelImages[currentImageIndex] }}
                        style={styles.hotelImage}
                    />
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                    <View style={styles.imageIndicator}>
                        {hotelImages.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.indicatorDot,
                                    index === currentImageIndex && styles.activeIndicatorDot
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.headerInfo}>
                        <Text style={styles.hotelName}>{hotel.name}</Text>
                        <View style={styles.locationContainer}>
                            <Text style={styles.locationIcon}>📍</Text>
                            <Text style={styles.location}>{hotel.location}</Text>
                        </View>
                        <View style={styles.ratingPriceContainer}>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.starIcon}>⭐</Text>
                                <Text style={styles.rating}>{hotel.rating}</Text>
                                <Text style={styles.ratingText}>({Math.floor(Math.random() * 500) + 100} reviews)</Text>
                            </View>
                            <Text style={styles.price}>${hotel.price}/night</Text>
                        </View>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{hotel.description}</Text>
                    </View>

                    <View style={styles.amenitiesContainer}>
                        <Text style={styles.sectionTitle}>Amenities</Text>
                        <View style={styles.amenitiesList}>
                            {hotel.amenities.map((amenity, index) => renderAmenity(amenity, index))}
                        </View>
                    </View>

                    <View style={styles.reviewsContainer}>
                        <View style={styles.reviewsHeader}>
                            <Text style={styles.sectionTitle}>Reviews</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Reviews', { hotel })}
                            >
                                <Text style={styles.seeAllText}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.reviewPreview}>
                            <View style={styles.reviewItem}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.reviewerInfo}>
                                        <View style={styles.reviewerAvatar}>
                                            <Text style={styles.reviewerInitial}>J</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.reviewerName}>John Doe</Text>
                                            <View style={styles.reviewRating}>
                                                <Text style={styles.starsText}>⭐⭐⭐⭐⭐</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.reviewText}>
                                    Amazing hotel with great service and beautiful views. Highly recommended!
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Starting from</Text>
                    <Text style={styles.bottomPrice}>${hotel.price}/night</Text>
                </View>
                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => navigation.navigate('Booking', { hotel })}
                >
                    <Text style={styles.bookButtonText}>Book Now</Text>
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
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
    },
    hotelImage: {
        width: width,
        height: 300,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    imageIndicator: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    indicatorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    activeIndicatorDot: {
        backgroundColor: 'white',
    },
    contentContainer: {
        padding: 20,
    },
    headerInfo: {
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
        marginBottom: 16,
    },
    locationIcon: {
        fontSize: 18,
        marginRight: 4,
    },
    location: {
        fontSize: 16,
        color: '#666',
    },
    ratingPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        fontSize: 18,
        marginRight: 4,
    },
    rating: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    ratingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    descriptionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    amenitiesContainer: {
        marginBottom: 24,
    },
    amenitiesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    amenityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    amenityIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    amenityText: {
        fontSize: 14,
        color: '#333',
    },
    reviewsContainer: {
        marginBottom: 100,
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    seeAllText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    reviewPreview: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 16,
    },
    reviewItem: {
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewerAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    reviewerInitial: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    reviewRating: {
        flexDirection: 'row',
        gap: 2,
    },
    starsText: {
        fontSize: 12,
    },
    reviewText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    bottomPrice: {
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

export default HotelDetailScreen;
