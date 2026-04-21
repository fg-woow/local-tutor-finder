import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getReviewsByTutorId, createReview, deleteReview } from "@/lib/api";
import type { Review as DbReview } from "@/lib/api";
import { Review as MockReview } from "@/data/tutors";

interface ReviewsProps {
    reviews: MockReview[];
    tutorId: string;
}

const Reviews = ({ reviews: mockReviews, tutorId }: ReviewsProps) => {
    const { user, profile } = useAuth();
    const [dbReviews, setDbReviews] = useState<DbReview[]>([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch real reviews from Supabase
    useEffect(() => {
        const fetchReviews = async () => {
            const { data } = await getReviewsByTutorId(tutorId);
            setDbReviews(data);
        };
        fetchReviews();
    }, [tutorId]);

    // Combine mock reviews with DB reviews
    const allReviews = [
        ...dbReviews.map((r) => ({
            id: r.id,
            studentName: r.student_name,
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.created_at).toISOString().split("T")[0],
            isFromDb: true,
            studentId: r.student_id,
        })),
        ...mockReviews.map((r) => ({
            ...r,
            isFromDb: false,
            studentId: null as string | null,
        })),
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please log in to submit a review");
            return;
        }
        if (!newComment.trim()) {
            toast.error("Please enter a comment");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setIsSubmitting(true);

        const { data, error } = await createReview({
            tutor_id: tutorId,
            student_id: user.id,
            student_name: profile?.full_name || "Anonymous",
            rating,
            comment: newComment.trim(),
        });

        if (error) {
            if (error.message.includes("duplicate") || error.message.includes("unique")) {
                toast.error("You've already reviewed this tutor");
            } else {
                toast.error("Failed to submit review. Please try again.");
            }
            setIsSubmitting(false);
            return;
        }

        if (data) {
            setDbReviews((prev) => [data, ...prev]);
        }

        setNewComment("");
        setRating(0);
        setIsSubmitting(false);
        toast.success("Review submitted successfully!");
    };

    const handleDelete = async (reviewId: string) => {
        const { error } = await deleteReview(reviewId);
        if (error) {
            toast.error("Failed to delete review");
            return;
        }
        setDbReviews((prev) => prev.filter((r) => r.id !== reviewId));
        toast.success("Review deleted");
    };

    return (
        <div className="space-y-8">
            {/* Add Review Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                    {user ? (
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

                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Review"}
                            </Button>
                        </form>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Please{" "}
                            <a href="/login" className="text-primary font-medium hover:underline">
                                log in
                            </a>{" "}
                            to write a review.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Student Reviews ({allReviews.length})</h3>
                {allReviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                    allReviews.map((review) => (
                        <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.studentName)}&background=random`} />
                                    <AvatarFallback>{review.studentName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">{review.studentName}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{review.date}</span>
                                            {review.isFromDb && review.studentId === user?.id && (
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                                    title="Delete your review"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>
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
