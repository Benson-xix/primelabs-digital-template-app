import { format, formatDistanceToNow } from "date-fns";
import React from "react";

interface ReviewListProps {
  reviews: any[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    if (format(now, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")) {
      return `Today at ${format(date, "HH:mm")}`;
    } else if (
      formatDistanceToNow(date, { addSuffix: true }).includes("yesterday")
    ) {
      return `Yesterday at ${format(date, "HH:mm")}`;
    } else {
      return format(date, "PPpp");
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-500">&#9733;</span>
        ))}
        {halfStar && <span className="text-yellow-500">&#9733;</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">&#9733;</span>
        ))}
      </>
    );
  };
  return (
    <div>
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-lg">No reviews yet.</p>
      ) : (
        <ul  className="flex flex-col gap-3 ">
          {reviews.map((review) => (
            <li className="w-full px-3 py-2 rounded-lg flex gap-3 mt-5  bg-blue-900" key={review.id}>
              <div className="text-gray-200 font-semibold md:text-xl text-sm">
                {review.user.email}
                <div className="flex flex-col gap-1">
                  <div className="text-orange-300 font-bold text-lg">
                  {renderStars(review.rating)}
                  </div>
                  <div className="text-white font-normal text-base">
                    {review.comment}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;
