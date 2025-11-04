import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ReviewsScreen = ({ route, navigation }) => {
    const { hotel } = route.params;
    const [newReview, setNewReview] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [showAddReview, setShowAddReview] = useState(false);

    const sampleReviews = [
        {
            id: 1,
            userName: 'John Doe',
            rating: 5,
            comment: 'Amazing hotel with great service and beautiful views. Highly recommended!',
            date: '2024-01-15',
            verified: true
        },
        {
            id: 2,
            userName: 'Sarah Smith',
            rating: 4,
            comment: 'Great location and comfortable rooms. The staff was very helpful throughout our stay.',
            date: '2024-01-10',
            verified: true
        },
        {
            id: 3,
            userName: 'Mike Johnson',
            rating: 5,
            comment: 'Perfect for a romantic getaway. The amenities were top-notch and the food was excellent.',
            date: '2024-01-05',
            verified: false
        },
        {
            id: 4,
            userName: 'Emily Brown',
            rating: 4,
            comment: 'Good value for money. Clean rooms and friendly staff. Would stay again.',
            date: '2023-12-28',
            verified: true
        },
        {
            id: 5,
            userName: 'David Wilson',
            rating: 3,
            comment: 'Decent hotel but could use some updates. The location is convenient though.',
            date: '2023-12-20',
            verified: true
        }
    ];

    const handleSubmitReview = () => {
        if (newRating === 0) {
            Alert.alert('Error', 'Please select a rating');
            return;
        }
        if (!newReview.trim()) {
            Alert.alert('Error', 'Please write a review');
            return;
        }

        Alert.alert('Success', 'Your review has been submitted!', [
            { text: 'OK', onPress: () => {
                    setNewReview('');
                    setNewRating(0);
                    setShowAddReview(false);
                }}
        ]);
    };

    const renderStars = (rating, size = 16, interactive = false, onPress = null) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => interactive && onPress && onPress(star)}
                        disabled={!interactive}
                    >
                        <Ionicons
                            name={star <= rating ? "star" : "star-outline"}
                            size={size}
                            color={star <= rating ? "#FFD700" : "#DDD"}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderReview = (review) => (
        <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                    <View style={styles.reviewerAvatar}>
                        <Text style={styles.reviewerInitial}>
                            {review.userName.charAt(0)}
                        </Text>
                    </View>
                    <View style={styles.reviewerDetails}>
                        <View style={styles.reviewerNameContainer}>
                            <Text style={styles.reviewerName}>{review.userName}</Text>
                            {review.verified && (
                                <Ionicons name="checkmark-circle" size={14} color="#28A745" />
                            )}
                        </View>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                </View>
                {renderStars(review.rating)}
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <View style={styles.reviewActions}>
                <TouchableOpacity style={styles.helpfulButton}>
                    <Ionicons name="thumbs-up-outline" size={16} color="#666" />
                    <Text style={styles.helpfulText}>Helpful</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.replyButton}>
                    <Ionicons name="chatbubble-outline" size={16} color="#666" />
                    <Text style={styles.replyText}>Reply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const averageRating = sampleReviews.reduce((sum, review) => sum + review.rating, 0) / sampleReviews.length;

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
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.summaryContainer}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    <View style={styles.ratingOverview}>
                        <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
                        <View style={styles.ratingDetails}>
                            {renderStars(Math.round(averageRating), 20)}
                            <Text style={styles.reviewCount}>
                                Based on {sampleReviews.length} reviews
                            </Text>
                        </View>
                    </View>

                    <View style={styles.ratingBreakdown}>
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = sampleReviews.filter(r => r.rating === rating).length;
                            const percentage = (count / sampleReviews.length) * 100;
                            return (
                                <View key={rating} style={styles.ratingRow}>
                                    <Text style={styles.ratingLabel}>{rating}</Text>
                                    <Ionicons name="star" size={12} color="#FFD700" />
                                    <View style={styles.ratingBar}>
                                        <View
                                            style={[styles.ratingFill, { width: `${percentage}%` }]}
                                        />
                                    </View>
                                    <Text style={styles.ratingCount}>{count}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.addReviewContainer}>
                    <TouchableOpacity
                        style={styles.addReviewButton}
                        onPress={() => setShowAddReview(!showAddReview)}
                    >
                        <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
                        <Text style={styles.addReviewText}>Write a Review</Text>
                    </TouchableOpacity>
                </View>

                {showAddReview && (
                    <View style={styles.addReviewForm}>
                        <Text style={styles.formTitle}>Share your experience</Text>
                        <View style={styles.ratingSelector}>
                            <Text style={styles.ratingLabel}>Rating:</Text>
                            {renderStars(newRating, 24, true, setNewRating)}
                        </View>
                        <TextInput
                            style={styles.reviewInput}
                            placeholder="Write your review here..."
                            value={newReview}
                            onChangeText={setNewReview}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                        <View style={styles.formButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowAddReview(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmitReview}
                            >
                                <Text style={styles.submitButtonText}>Submit Review</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.reviewsContainer}>
                    <Text style={styles.reviewsTitle}>All Reviews</Text>
                    {sampleReviews.map(renderReview)}
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    scrollView: {
        flex: 1,
    },
    summaryContainer: {
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    hotelName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    ratingOverview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    averageRating: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 20,
    },
    ratingDetails: {
        flex: 1,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 8,
    },
    reviewCount: {
        fontSize: 14,
        color: '#666',
    },
    ratingBreakdown: {
        gap: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingLabel: {
        fontSize: 14,
        color: '#333',
        width: 12,
    },
    ratingBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E5E5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    ratingFill: {
        height: '100%',
        backgroundColor: '#FFD700',
    },
    ratingCount: {
        fontSize: 12,
        color: '#666',
        width: 20,
        textAlign: 'right',
    },
    addReviewContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    addReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 8,
        gap: 8,
    },
    addReviewText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    addReviewForm: {
        padding: 20,
        backgroundColor: '#F8F9FA',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    ratingSelector: {
        marginBottom: 20,
    },
    reviewInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        height: 100,
        marginBottom: 20,
    },
    formButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    reviewsContainer: {
        padding: 20,
    },
    reviewsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    reviewCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    reviewerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    reviewerInitial: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewerDetails: {
        flex: 1,
    },
    reviewerNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    reviewDate: {
        fontSize: 12,
        color: '#666',
    },
    reviewComment: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 12,
    },
    reviewActions: {
        flexDirection: 'row',
        gap: 20,
    },
    helpfulButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    helpfulText: {
        fontSize: 12,
        color: '#666',
    },
    replyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    replyText: {
        fontSize: 12,
        color: '#666',
    },
});

export default ReviewsScreen;

