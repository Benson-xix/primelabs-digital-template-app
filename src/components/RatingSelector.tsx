import { SetStateAction } from "react";

interface RatingSelectorProps {
  rating: number;
  setRating: (rating: number) => void;
}

const RatingSelector: React.FC<RatingSelectorProps> = ({ rating, setRating }) => {
  const handleRatingClick = (num: number) => {
    setRating(num);
  };

  return (
    <div className="grid gap-3 py-2">
      <label>Rating</label>
      <div className="grid grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            className={`p-2 border rounded-md cursor-pointer transition-all duration-200 ${
              rating === num ? "bg-blue-500 text-white flex items-center justify-center" : "bg-gray-400 hover:bg-gray-200 flex items-center justify-center"
            }`}
            onClick={() => handleRatingClick(num)}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSelector;
