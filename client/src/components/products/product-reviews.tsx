import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Star, User, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userEmail?: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول لإضافة تقييم",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "اختر التقييم",
        description: "يرجى اختيار تقييم من 1 إلى 5 نجوم",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      if (response.ok) {
        toast({
          title: "تم إضافة التقييم",
          description: "شكراً لك على تقييمك!",
        });

        // Reset form
        setRating(0);
        setComment("");

        // Refresh reviews
        fetchReviews();
      } else {
        const error = await response.json();
        toast({
          title: "خطأ",
          description: error.message || "فشل إضافة التقييم",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة التقييم",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const renderStars = (value: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}
          >
            <Star
              className={`h-5 w-5 ${
                star <= (interactive ? (hoverRating || rating) : value)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            تقييمات العملاء
          </CardTitle>
          <CardDescription>
            {reviews.length > 0 ? (
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {averageRating.toFixed(1)}
                  </span>
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-muted-foreground">
                  ({reviews.length} {reviews.length === 1 ? "تقييم" : "تقييمات"})
                </span>
              </div>
            ) : (
              <p className="text-muted-foreground mt-2">لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!</p>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Add Review Form */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>أضف تقييمك</CardTitle>
            <CardDescription>شارك تجربتك مع {productName}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">التقييم *</label>
                {renderStars(rating, true)}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">تعليقك (اختياري)</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="شارك تجربتك مع هذا المنتج..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button type="submit" disabled={submitting || rating === 0}>
                {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">جميع التقييمات</h3>
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {review.userEmail?.split("@")[0] || "مستخدم"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("ar-IQ", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
