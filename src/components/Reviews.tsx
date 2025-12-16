import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp } from "lucide-react";
import { Review } from "@/data/tutors";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReviewsProps {
    reviews: Review[];
    tutorId: string;
}

const Reviews = ({ reviews: initialReviews, tutorId }: ReviewsProps) => {
    const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) {
            toast.error("Please enter a comment");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        const newReview: Review = {
            id: Math.random().toString(36).substr(2, 9),
            studentName: "Current User", // In a real app, get from auth context
            rating,
            comment: newComment,
            date: new Date().toISOString().split('T')[0],
        };

        setReviews([newReview, ...reviews]);
        setNewComment("");
        setRating(0);
        toast.success("Review submitted successfully!");
    };

    return (
        <div className="space-y-8">
            {/* Add Review Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Your Rating:</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            className={`h-6 w-6 ${star <= (hoverRating || rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted-foreground"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Textarea
                            placeholder="Share your experience with this tutor..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="resize-none"
                            rows={4}
                        />

                        <Button type="submit">Submit Review</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Student Reviews ({reviews.length})</h3>
                {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.studentName)}&background=random`} />
                                    <AvatarFallback>{review.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">{review.studentName}</h4>
                                        <span className="text-sm text-muted-foreground">{review.date}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-muted-foreground leading-relaxed">
                                        {review.comment}
                                    </p>

                                    <div className="flex items-center gap-4 pt-2">
                                        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group">
                                            <ThumbsUp className="h-3.5 w-3.5 group-hover:text-primary" />
                                            Helpful
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;
