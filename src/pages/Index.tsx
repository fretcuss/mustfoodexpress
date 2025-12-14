import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Star, MapPin, ChefHat } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Delicious food spread"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        
        <div className="container relative z-10 flex min-h-[85vh] flex-col items-center justify-center py-20 text-center">
          <div className="animate-fade-up max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Discover Local{" "}
              <span className="text-gradient">Flavors</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 sm:text-xl">
              Explore the best local food shops, read honest reviews, and find your next favorite meal. 
              Join our community of food lovers today.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/shops">
                <Button variant="hero" size="xl">
                  Browse Shops
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth?mode=signup&role=shop_owner">
                <Button variant="warm" size="xl" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
                  <ChefHat className="mr-2 h-5 w-5" />
                  List Your Shop
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose FoodieSpot?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The easiest way to discover and share local food gems
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Find Local Shops",
                description: "Discover amazing food shops in your area with detailed information and real-time stock updates.",
              },
              {
                icon: Star,
                title: "Honest Reviews",
                description: "Read authentic reviews from fellow food lovers and share your own dining experiences.",
              },
              {
                icon: ChefHat,
                title: "For Shop Owners",
                description: "Manage your menu, update stock availability, and connect with customers effortlessly.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-border/50 bg-card p-8 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground shadow-warm">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-secondary/30 py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join thousands of food lovers and shop owners already using FoodieSpot
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="lg">
                Sign Up Free
              </Button>
            </Link>
            <Link to="/shops">
              <Button variant="outline" size="lg">
                Explore Shops
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 FoodieSpot. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
