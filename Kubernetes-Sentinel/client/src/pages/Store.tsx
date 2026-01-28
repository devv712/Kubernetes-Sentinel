import { useProducts, useCreateOrder } from "@/hooks/use-store";
import { Link } from "wouter";
import { ShoppingCart, Star, ArrowLeft, Loader2, Plus, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Store() {
  const { data: products, isLoading } = useProducts();
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  const [cart, setCart] = useState<number[]>([]);

  const addToCart = (id: number) => {
    setCart([...cart, id]);
    toast({
      title: "Added to cart",
      description: "Product added to your shopping cart",
      variant: "default",
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Group items by ID
    const items = Object.entries(
      cart.reduce((acc, id) => ({ ...acc, [id]: (acc[id] || 0) + 1 }), {} as Record<number, number>)
    ).map(([productId, quantity]) => ({ productId: Number(productId), quantity }));

    createOrder.mutate(items, {
      onSuccess: () => {
        setCart([]);
        toast({
          title: "Order Placed! 🎉",
          description: "Thank you for your purchase. Tracking ID generated.",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "Order Failed ❌",
          description: "System error: 503 Service Unavailable (Simulated)",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white text-gray-900 store-theme">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans store-theme">
      {/* Store Header */}
      <header className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="font-bold text-xl tracking-tight text-purple-600">MicroShop</div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-gray-500 hidden md:block">
              Simulates User Traffic for Observability
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || createOrder.isPending}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-purple-600 transition-colors" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-purple-50 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
            Shop the Future
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our collection of simulated microservices products. Every click generates real metrics for the SRE dashboard.
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="aspect-[4/5] bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                {/* Simulated Product Image Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-300 font-bold text-4xl">
                  {product.name.charAt(0)}
                </div>
                
                {/* Quick Add Overlay */}
                <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button 
                    onClick={() => addToCart(product.id)}
                    className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                  <span className="font-medium text-purple-600">${product.price}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-1 text-yellow-400 text-xs mt-2">
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-gray-400 ml-1">(128)</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
