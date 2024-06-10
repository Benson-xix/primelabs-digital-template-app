import { trpc } from "@/trpc/client";
import React, { useState } from "react";
import RatingSelector from "./RatingSelector";
import { Button } from "./ui/button";

interface ReviewFormProps {
  productId: string;
  onNewReview: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onNewReview }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const createReviewMutation = trpc.review.createReview.useMutation();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await createReviewMutation.mutateAsync({ productId, rating, comment });
      setRating(1);
      setComment("");
      onNewReview();
    } catch (error) {
      console.error("Failed to create review", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <RatingSelector rating={rating} setRating={setRating} />

        <div className="grid gap-3 py-2">
        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your message</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            id="message"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          >
            {" "}
          </textarea>
        </div>

        <Button type="submit">Submit Review</Button>
      </div>
    </form>
  );
};

export default ReviewForm;
