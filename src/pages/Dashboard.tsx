import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Star, Store } from "lucide-react";
import { ReviewCard } from "@/components/ReviewCard";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Shop form
  const [shopDialogOpen, setShopDialogOpen] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [shopImageUrl, setShopImageUrl] = useState("");
  const [savingShop, setSavingShop] = useState(false);
  
  // Item form
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [itemInStock, setItemInStock] = useState(true);
  const [savingItem, setSavingItem] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== "shop_owner")) {
      navigate("/");
    }
  }, [user, profile, authLoading, navigate]);

  useEffect(() => {
    if (user && profile?.role === "shop_owner") {
      fetchShopData();
    }
  }, [user, profile]);

  const fetchShopData = async () => {
    const { data: shopData } = await supabase
      .from("shops")
      .select("*")
      .eq("owner_id", user!.id)
      .maybeSingle();

    if (shopData) {
      setShop(shopData);
      setShopName(shopData.name);
      setShopDescription(shopData.description || "");
      setShopLocation(shopData.location || "");
      setShopImageUrl(shopData.image_url || "");

      const [itemsRes, reviewsRes] = await Promise.all([
        supabase.from("food_items").select("*").eq("shop_id", shopData.id).order("name"),
        supabase
          .from("reviews")
          .select("*, profiles(full_name)")
          .eq("shop_id", shopData.id)
          .order("created_at", { ascending: false }),
      ]);

      if (itemsRes.data) setItems(itemsRes.data);
      if (reviewsRes.data) setReviews(reviewsRes.data as unknown as Review[]);
    }
    setLoading(false);
  };

  const handleSaveShop = async () => {
    if (!shopName.trim()) {
      toast.error("Shop name is required");
      return;
    }

    setSavingShop(true);

    if (shop) {
      const { error } = await supabase
        .from("shops")
        .update({
          name: shopName.trim(),
          description: shopDescription.trim() || null,
          location: shopLocation.trim() || null,
          image_url: shopImageUrl.trim() || null,
        })
        .eq("id", shop.id);

      if (error) {
        toast.error("Failed to update shop");
      } else {
        toast.success("Shop updated!");
        setShopDialogOpen(false);
        fetchShopData();
      }
    } else {
      const { error } = await supabase.from("shops").insert({
        owner_id: user!.id,
        name: shopName.trim(),
        description: shopDescription.trim() || null,
        location: shopLocation.trim() || null,
        image_url: shopImageUrl.trim() || null,
      });

      if (error) {
        toast.error("Failed to create shop");
      } else {
        toast.success("Shop created!");
        setShopDialogOpen(false);
        fetchShopData();
      }
    }

    setSavingShop(false);
  };

  const openItemDialog = (item?: FoodItem) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.name);
      setItemDescription(item.description || "");
      setItemPrice(item.price.toString());
      setItemImageUrl(item.image_url || "");
      setItemInStock(item.in_stock);
    } else {
      setEditingItem(null);
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setItemImageUrl("");
      setItemInStock(true);
    }
    setItemDialogOpen(true);
  };

  const handleSaveItem = async () => {
    if (!itemName.trim() || !itemPrice) {
      toast.error("Name and price are required");
      return;
    }

    const priceNum = parseFloat(itemPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setSavingItem(true);

    const itemData = {
      shop_id: shop!.id,
      name: itemName.trim(),
      description: itemDescription.trim() || null,
      price: priceNum,
      image_url: itemImageUrl.trim() || null,
      in_stock: itemInStock,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("food_items")
        .update(itemData)
        .eq("id", editingItem.id);

      if (error) {
        toast.error("Failed to update item");
      } else {
        toast.success("Item updated!");
        setItemDialogOpen(false);
        fetchShopData();
      }
    } else {
      const { error } = await supabase.from("food_items").insert(itemData);

      if (error) {
        toast.error("Failed to add item");
      } else {
        toast.success("Item added!");
        setItemDialogOpen(false);
        fetchShopData();
      }
    }

    setSavingItem(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    const { error } = await supabase.from("food_items").delete().eq("id", itemId);
    if (error) {
      toast.error("Failed to delete item");
    } else {
      toast.success("Item deleted");
      fetchShopData();
    }
  };

  const handleToggleStock = async (item: FoodItem) => {
    const { error } = await supabase
      .from("food_items")
      .update({ in_stock: !item.in_stock })
      .eq("id", item.id);

    if (!error) {
      fetchShopData();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Shop Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your shop, menu items, and view customer feedback
            </p>
          </div>
        </div>

        {/* Shop Info */}
        {shop ? (
          <Card className="mb-8 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display">{shop.name}</CardTitle>
              <Dialog open={shopDialogOpen} onOpenChange={setShopDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Shop
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Shop</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Shop Name *</Label>
                      <Input value={shopName} onChange={(e) => setShopName(e.target.value)} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={shopDescription} onChange={(e) => setShopDescription(e.target.value)} />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={shopLocation} onChange={(e) => setShopLocation(e.target.value)} />
                    </div>
                    <div>
                      <Label>Image URL</Label>
                      <Input value={shopImageUrl} onChange={(e) => setShopImageUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <Button variant="hero" className="w-full" onClick={handleSaveShop} disabled={savingShop}>
                      {savingShop ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6 text-sm">
                {shop.location && <span className="text-muted-foreground">📍 {shop.location}</span>}
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-golden-amber text-golden-amber" />
                  {Number(shop.average_rating).toFixed(1)} ({shop.total_reviews} reviews)
                </span>
              </div>
              {shop.description && <p className="mt-4 text-muted-foreground">{shop.description}</p>}
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-dashed border-2 border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Store className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-display text-lg font-semibold">Create Your Shop</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by setting up your shop profile</p>
              <Dialog open={shopDialogOpen} onOpenChange={setShopDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Shop
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Your Shop</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Shop Name *</Label>
                      <Input value={shopName} onChange={(e) => setShopName(e.target.value)} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={shopDescription} onChange={(e) => setShopDescription(e.target.value)} />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={shopLocation} onChange={(e) => setShopLocation(e.target.value)} />
                    </div>
                    <div>
                      <Label>Image URL</Label>
                      <Input value={shopImageUrl} onChange={(e) => setShopImageUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <Button variant="hero" className="w-full" onClick={handleSaveShop} disabled={savingShop}>
                      {savingShop ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Shop"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}

        {shop && (
          <>
            {/* Menu Items */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground">Menu Items</h2>
                <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero" size="sm" onClick={() => openItemDialog()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Name *</Label>
                        <Input value={itemName} onChange={(e) => setItemName(e.target.value)} />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} />
                      </div>
                      <div>
                        <Label>Price *</Label>
                        <Input type="number" step="0.01" min="0" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
                      </div>
                      <div>
                        <Label>Image URL</Label>
                        <Input value={itemImageUrl} onChange={(e) => setItemImageUrl(e.target.value)} placeholder="https://..." />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>In Stock</Label>
                        <Switch checked={itemInStock} onCheckedChange={setItemInStock} />
                      </div>
                      <Button variant="hero" className="w-full" onClick={handleSaveItem} disabled={savingItem}>
                        {savingItem ? <Loader2 className="h-4 w-4 animate-spin" /> : editingItem ? "Update Item" : "Add Item"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {items.length === 0 ? (
                <p className="text-muted-foreground">No items added yet.</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <Card key={item.id} className={`border-border/50 ${!item.in_stock ? "opacity-60" : ""}`}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-2xl">🍴</div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">${Number(item.price).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`stock-${item.id}`} className="text-xs text-muted-foreground">
                              In Stock
                            </Label>
                            <Switch
                              id={`stock-${item.id}`}
                              checked={item.in_stock}
                              onCheckedChange={() => handleToggleStock(item)}
                            />
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => openItemDialog(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Reviews */}
            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet.</p>
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
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
