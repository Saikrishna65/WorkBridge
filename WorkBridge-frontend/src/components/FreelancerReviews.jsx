import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const FreelancerReviews = () => {
  const { freelancerUser } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/freelancers/reviews", {
          headers: {
            Authorization: `Bearer ${freelancerUser.token}`, // assuming token is stored here
          },
        });

        if (!res.ok) throw new Error("Failed to fetch reviews");

        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (freelancerUser) {
      fetchReviews();
    }
  }, [freelancerUser]);

  if (loading) return <div className="p-10">Loading reviews...</div>;

  return (
    <div className="p-4 md:p-10 space-y-6">
      <h2 className="text-2xl md:text-3xl font-semibold">Client Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="w-full md:w-68 p-4 rounded-lg bg-gray-200"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={review.reviewer.avatar || "/default-avatar.png"}
                  alt={review.reviewer.name}
                  className="w-10 h-10 rounded-tr-xl rounded-br-xl rounded-bl-xl object-cover"
                />
                <p className="font-semibold">{review.reviewer.name}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-700">"{review.comment}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerReviews;
