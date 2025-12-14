import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  rating: number;
  comment: string | null;
  createdAt: string;
  userName: string | null;
}

export function ReviewCard({ rating, comment, createdAt, userName }: ReviewCardProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
              {userName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="font-medium text-foreground">{userName || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating
                    ? "fill-golden-amber text-golden-amber"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
        </div>
        
        {comment && (
          <p className="mt-3 text-sm text-muted-foreground">{comment}</p>
        )}
      </CardContent>
    </Card>
  );
}
