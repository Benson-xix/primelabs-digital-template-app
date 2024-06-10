"use client"

import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { trpc } from '@/trpc/client';
import { Review } from '@/payload-types';

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { data: reviewsData, refetch: refetchReviews } = trpc.review.getReviewsForProduct.useQuery(productId);
  const { data: userOrders, refetch: refetchUserOrders } = trpc.payment.getUserOrders.useQuery();

  useEffect(() => {
    if (reviewsData) {
      setReviews(reviewsData);
    }
  }, [reviewsData]);

  useEffect(() => {
    const checkIfUserHasPurchasedProduct = () => {
      console.log("userOrders", userOrders);
      console.log("productId", productId);


        if (!userOrders) return false;
       return userOrders.some((order: any) => order.products.some((product: any) => product.id === productId));
    };

    const hasPurchased = checkIfUserHasPurchasedProduct();
    console.log("hasPurchased", hasPurchased);
    setHasPurchased(hasPurchased);
    refetchUserOrders();
    console.log(refetchUserOrders);
}, [productId, userOrders, refetchUserOrders]);

  const handleNewReview = () => {
    refetchReviews();
  };

  return (
    <div className='mt-4'>
      <h2 className='font-bold text-2xl text-blue-900'>Reviews</h2>
      {!hasPurchased && <p className='text-lg text-rose-400 '>You must purchase the product to leave a review.</p>}
      {hasPurchased && <ReviewForm productId={productId} onNewReview={handleNewReview} />}
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default ReviewSection;
