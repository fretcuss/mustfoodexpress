import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FoodItemCardProps {
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  inStock: boolean;
}

export function FoodItemCard({
  name,
  description,
  price,
  imageUrl,
  inStock,
}: FoodItemCardProps) {
  return (
    <Card className={`overflow-hidden border-border/50 transition-all duration-300 ${!inStock ? "opacity-60" : "hover-lift"}`}>
      <div className="flex gap-4 p-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary">
              <span className="text-3xl">🍴</span>
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h4 className="font-semibold text-foreground">{name}</h4>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold text-primary">
              ${price.toFixed(2)}
            </span>
            {inStock && (
              <Badge variant="outline" className="border-olive-green/30 bg-olive-green/10 text-olive-green">
                Available
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
