import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { FoodItemCard } from "@/components/FoodItemCard";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Star, MapPin, ArrowLeft, Loader2, MessageSquarePlus } from "lucide-react";

interface Shop {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  average_rating: number;
  total_reviews: number;
}

interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  in_stock: boolean;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: { full_name: string | null } | null;
}

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchShopData();
    }
  }, [id]);

  const fetchShopData = async () => {
    const [shopRes, itemsRes, reviewsRes] = await Promise.all([
      supabase.from("shops").select("*").eq("id", id).maybeSingle(),
      supabase.from("food_items").select("*").eq("shop_id", id).order("name"),
      supabase
        .from("reviews")
        .select("*, profiles(full_name)")
        .eq("shop_id", id)
        .order("created_at", { ascending: false }),
    ]);

    if (shopRes.data) setShop(shopRes.data);
    if (itemsRes.data) setItems(itemsRes.data);
    if (reviewsRes.data) setReviews(reviewsRes.data as unknown as Review[]);
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (!user || !id) return;

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      shop_id: id,
      user_id: user.id,
      rating: newRating,
      comment: newComment.trim() || null,
    });

    if (error) {
      toast.error("Failed to submit review");
    } else {
      toast.success("Review submitted successfully!");
      setReviewDialogOpen(false);
      setNewComment("");
      setNewRating(5);
      fetchShopData();
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 text-center">
          <h1 className="font-display text-2xl font-bold">Shop not found</h1>
          <Link to="/shops">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shops
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <div className="relative h-64 overflow-hidden bg-muted sm:h-80">
        {shop.image_url ? (
          <img
            src={shop.image_url}
            alt={shop.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-warm opacity-30">
            <span className="text-8xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container">
            <Link to="/shops" className="inline-flex items-center gap-1 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-3">
              <ArrowLeft className="h-4 w-4" />
              Back to Shops
            </Link>
            <h1 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
              {shop.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-primary-foreground/90">
              <span className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-golden-amber text-golden-amber" />
                {Number(shop.average_rating).toFixed(1)} ({shop.total_reviews} reviews)
              </span>
              {shop.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {shop.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container py-8">
        {shop.description && (
          <p className="mb-8 text-lg text-muted-foreground">{shop.description}</p>
        )}

        {/* Menu Items */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            Menu Items
          </h2>
          {items.length === 0 ? (
            <p className="text-muted-foreground">No items available yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <FoodItemCard
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  price={Number(item.price)}
                  imageUrl={item.image_url}
                  inStock={item.in_stock}
                />
              ))}
            </div>
          )}
        </section>

        {/* Reviews */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Reviews
            </h2>
            {user && profile?.role === "customer" && (
              <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" size="sm">
                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= newRating
                                  ? "fill-golden-amber text-golden-amber"
                                  : "text-muted"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Comment (optional)</label>
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your experience..."
                        rows={4}
                      />
                    </div>
                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={handleSubmitReview}
                      disabled={submitting}
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Review"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {reviews.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  rating={review.rating}
                  comment={review.comment}
                  createdAt={review.created_at}
                  userName={review.profiles?.full_name || null}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ShopDetail;
