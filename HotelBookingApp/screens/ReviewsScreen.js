import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const ReviewsScreen = ({ navigation, route }) => {
    const { hotel } = route.params;
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [showAddReviewModal, setShowAddReviewModal] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [userHasReviewed, setUserHasReviewed] = useState(false);

    const sampleReviews = [
        {
            id: 1,
            userName: 'John Smith',
            rating: 5,
            text: 'Amazing hotel with excellent service! The staff was very friendly and the rooms were clean and comfortable.',
            date: '2024-10-15',
            userId: 'user1'
        },
        {
            id: 2,
            userName: 'Sarah Johnson',
            rating: 4,
            text: 'Great location and comfortable rooms. The breakfast was delicious and the view from my room was spectacular.',
            date: '2024-10-10',
            userId: 'user2'
        },
        {
            id: 3,
            userName: 'Mike Wilson',
            rating: 4,
            text: 'Good value for money. Clean rooms and helpful staff. Would definitely stay here again.',
            date: '2024-10-05',
            userId: 'user3'
        }
    ];

    useEffect(() => {
        setReviews(sampleReviews);
        checkUserReview();
    }, []);

    const checkUserReview = () => {
        if (user) {
            const userReview = sampleReviews.find(review => review.userId === user.uid);
            setUserHasReviewed(!!userReview);
        }
    };

    const handleAddReview = () => {
        if (!user) {
            Alert.alert('Sign In Required', 'Please sign in to add a review.');
            return;
        }

        if (userHasReviewed) {
            Alert.alert('Review Exists', 'You have already reviewed this hotel.');
            return;
        }

        setShowAddReviewModal(true);
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
            text: reviewText.trim(),
            date: new Date().toISOString().split('T')[0],
            userId: user.uid
        };

        setReviews([newReview, ...reviews]);
        setUserHasReviewed(true);
        setShowAddReviewModal(false);
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

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
    };

    const renderReviewItem = ({ item }) => (
        <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{item.userName}</Text>
                    <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
                <View style={styles.reviewStars}>
                    {renderStars(item.rating)}
                </View>
            </View>
            <Text style={styles.reviewText}>{item.text}</Text>
        </View>
    );

    const renderRatingBar = (stars, count, total) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
            <View style={styles.ratingBarContainer}>
                <Text style={styles.ratingBarLabel}>{stars}</Text>
                <View style={styles.ratingBar}>
                    <View style={[styles.ratingBarFill, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.ratingBarCount}>{count}</Text>
            </View>
        );
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
                <Text style={styles.headerTitle}>Reviews</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddReview}
                >
                    <Ionicons name="add" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.summarySection}>
                <View style={styles.ratingOverview}>
                    <Text style={styles.averageRating}>{calculateAverageRating()}</Text>
                    <View style={styles.averageStars}>
                        {renderStars(Math.round(parseFloat(calculateAverageRating())))}
                    </View>
                    <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
                </View>

                <View style={styles.ratingDistribution}>
                    {Object.entries(getRatingDistribution())
                        .reverse()
                        .map(([stars, count]) => (
                            <View key={stars}>
                                {renderRatingBar(stars, count, reviews.length)}
                            </View>
                        ))}
                </View>
            </View>

            <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.reviewsList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubble-outline" size={64} color="#CCC" />
                        <Text style={styles.emptyText}>No reviews yet</Text>
                        <Text style={styles.emptySubtext}>Be the first to review this hotel!</Text>
                    </View>
                }
            />

            <Modal
                visible={showAddReviewModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowAddReviewModal(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowAddReviewModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Add Review</Text>
                        <TouchableOpacity onPress={submitReview}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>
                        <Text style={styles.hotelName}>{hotel.name}</Text>

                        <Text style={styles.ratingLabel}>Rating</Text>
                        <View style={styles.ratingSelector}>
                            {renderRatingStars(reviewRating, setReviewRating)}
                        </View>

                        <Text style={styles.reviewLabel}>Your Review</Text>
                        <TextInput
                            style={styles.reviewInput}
                            multiline
                            numberOfLines={6}
                            placeholder="Share your experience at this hotel..."
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
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    summarySection: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    ratingOverview: {
        flex: 1,
        alignItems: 'center',
    },
    averageRating: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    averageStars: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    reviewCount: {
        fontSize: 14,
        color: '#666',
    },
    ratingDistribution: {
        flex: 1,
        paddingLeft: 20,
    },
    ratingBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingBarLabel: {
        width: 20,
        fontSize: 14,
        color: '#666',
    },
    ratingBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E5E5',
        borderRadius: 4,
        marginHorizontal: 12,
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 4,
    },
    ratingBarCount: {
        width: 30,
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
    },
    reviewsList: {
        padding: 20,
    },
    reviewItem: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reviewerInfo: {
        flex: 1,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    reviewDate: {
        fontSize: 12,
        color: '#999',
    },
    reviewStars: {
        flexDirection: 'row',
    },
    reviewText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
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
    hotelName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
        textAlign: 'center',
    },
    ratingLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    ratingSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
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

export default ReviewsScreen;
