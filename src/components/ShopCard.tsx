import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ShopCardProps {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  imageUrl: string | null;
  averageRating: number;
  totalReviews: number;
}

export function ShopCard({
  id,
  name,
  description,
  location,
  imageUrl,
  averageRating,
  totalReviews,
}: ShopCardProps) {
  return (
    <Link to={`/shop/${id}`}>
      <Card className="group overflow-hidden hover-lift border-border/50 bg-card">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-warm opacity-20">
              <span className="text-6xl">🍽️</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-hero opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
              {name}
            </h3>
            <Badge variant="secondary" className="flex shrink-0 items-center gap-1 bg-golden-amber/10 text-golden-amber">
              <Star className="h-3 w-3 fill-current" />
              {averageRating?.toFixed(1) || "New"}
            </Badge>
          </div>
          
          {description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </span>
            )}
            <span className="text-xs">•</span>
            <span>{totalReviews} reviews</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
