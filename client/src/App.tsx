import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/cart-context";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetails from "@/pages/product-details";
import Calculators from "@/pages/calculators";
import Journey from "@/pages/journey";
import FishFinder from "@/pages/fish-finder";
import Sustainability from "@/pages/sustainability";
import FeaturedProduct from "@/pages/products-featured";
import EquipmentDetails from "@/pages/equipment-details";
import EcoFriendlyGuide from "@/pages/guides-eco-friendly";
import ReturnPolicy from "@/pages/return-policy";
import PrivacyPolicy from "@/pages/privacy-policy";
import Terms from "@/pages/terms";
import FAQ from "@/pages/faq";
import OrderTracking from "@/pages/order-tracking";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ar" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/featured" component={FeaturedProduct} />
      <Route path="/products/:slug" component={ProductDetails} />
      <Route path="/equipment/:slug" component={EquipmentDetails} />
      <Route path="/guides/eco-friendly" component={EcoFriendlyGuide} />
      <Route path="/calculators" component={Calculators} />
      <Route path="/journey" component={Journey} />
      <Route path="/fish-finder" component={FishFinder} />
      <Route path="/sustainability" component={Sustainability} />
      <Route path="/return-policy" component={ReturnPolicy} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms" component={Terms} />
      <Route path="/faq" component={FAQ} />
      <Route path="/order-tracking" component={OrderTracking} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          {/* Skip to main content for keyboard navigation */}
          <a href="#main-content" className="skip-to-main">
            الانتقال إلى المحتوى الرئيسي
          </a>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
