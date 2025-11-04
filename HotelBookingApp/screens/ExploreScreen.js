import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ExploreScreen = ({ navigation }) => {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [isLoading, setIsLoading] = useState(true);
    const [weather, setWeather] = useState(null);

    const sampleHotels = [
        {
            id: 1,
            name: 'Grand Hotel',
            location: 'New York, NY',
            rating: 4.5,
            price: 250,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
            description: 'Luxurious hotel in the heart of Manhattan',
            amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant']
        },
        {
            id: 2,
            name: 'Ocean View Resort',
            location: 'Miami Beach, FL',
            rating: 4.8,
            price: 180,
            image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
            description: 'Beautiful beachfront resort with stunning ocean views',
            amenities: ['Beach Access', 'Pool', 'Spa', 'Restaurant']
        },
        {
            id: 3,
            name: 'Mountain Lodge',
            location: 'Aspen, CO',
            rating: 4.2,
            price: 320,
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
            description: 'Cozy mountain lodge with scenic views',
            amenities: ['Fireplace', 'Skiing', 'Restaurant', 'WiFi']
        }
    ];

    useEffect(() => {
        loadHotels();
        fetchWeather();
    }, []);

    useEffect(() => {
        filterAndSortHotels();
    }, [searchQuery, sortBy, hotels]);

    const loadHotels = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setHotels(sampleHotels);
        } catch (error) {
            Alert.alert('Error', 'Failed to load hotels');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWeather = async () => {
        try {
            const response = await fetch(
                'https://api.openweathermap.org/data/2.5/weather?q=New York&appid=demo_key&units=metric'
            );
            if (response.ok) {
                const data = await response.json();
                setWeather(data);
            }
        } catch (error) {
            console.log('Weather API not available');
        }
    };

    const filterAndSortHotels = () => {
        let filtered = hotels;

        if (searchQuery) {
            filtered = hotels.filter(
                hotel =>
                    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.price - b.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        setFilteredHotels(filtered);
    };

    const renderHotelCard = ({ item }) => (
        <TouchableOpacity
            style={styles.hotelCard}
            onPress={() => navigation.navigate('HotelDetail', { hotel: item })}
        >
            <Image source={{ uri: item.image }} style={styles.hotelImage} />
            <View style={styles.hotelInfo}>
                <Text style={styles.hotelName}>{item.name}</Text>
                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.hotelLocation}>{item.location}</Text>
                </View>
                <View style={styles.ratingPriceContainer}>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                    <Text style={styles.price}>${item.price}/night</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderSortButton = (value, label) => (
        <TouchableOpacity
            style={[styles.sortButton, sortBy === value && styles.activeSortButton]}
            onPress={() => setSortBy(value)}
        >
            <Text style={[styles.sortButtonText, sortBy === value && styles.activeSortButtonText]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading hotels...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Explore Hotels</Text>
                {weather && (
                    <View style={styles.weatherContainer}>
                        <Ionicons name="sunny-outline" size={20} color="#007AFF" />
                        <Text style={styles.weatherText}>{Math.round(weather.main?.temp)}°C</Text>
                    </View>
                )}
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search-outline" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search hotels..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Sort by:</Text>
                <View style={styles.sortButtons}>
                    {renderSortButton('name', 'Name')}
                    {renderSortButton('price', 'Price')}
                    {renderSortButton('rating', 'Rating')}
                </View>
            </View>

            <FlatList
                data={filteredHotels}
                renderItem={renderHotelCard}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.hotelsList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={64} color="#CCC" />
                        <Text style={styles.emptyText}>No hotels found</Text>
                        <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
                    </View>
                }
            />
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
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    weatherContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    sortContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sortLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    sortButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    sortButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
    },
    activeSortButton: {
        backgroundColor: '#007AFF',
    },
    sortButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeSortButtonText: {
        color: '#FFFFFF',
    },
    hotelsList: {
        paddingHorizontal: 20,
    },
    hotelCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    hotelImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    hotelInfo: {
        padding: 16,
    },
    hotelName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    hotelLocation: {
        marginLeft: 4,
        fontSize: 14,
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
    rating: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
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
    },
});

export default ExploreScreen;
