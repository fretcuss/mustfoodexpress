import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Utensils } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-foreground text-center">
            About FoodieSpot
          </h1>
          <p className="mt-4 text-lg text-muted-foreground text-center">
            Connecting food lovers with amazing local eateries
          </p>
          
          <div className="mt-12 prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg leading-relaxed">
              FoodieSpot was born from a simple idea: everyone deserves to discover incredible 
              local food experiences. We believe that the best meals often come from small, 
              passionate shop owners who pour their heart into every dish.
            </p>
            
            <p className="text-muted-foreground text-lg leading-relaxed mt-6">
              Our platform bridges the gap between hungry customers and talented food 
              entrepreneurs, making it easier than ever to find your next favorite meal 
              and support local businesses.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Community First",
                description: "Built by food lovers, for food lovers. Every review helps the community.",
              },
              {
                icon: Utensils,
                title: "Quality Focus",
                description: "We celebrate shops that prioritize quality ingredients and authentic flavors.",
              },
              {
                icon: Heart,
                title: "Local Love",
                description: "Supporting small businesses and the passionate people behind them.",
              },
            ].map((item, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
