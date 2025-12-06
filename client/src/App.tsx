import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { AuthProvider } from "@/contexts/auth-context";
import { RequireAdmin } from "@/components/auth/require-admin";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { FloatingActionButton } from "@/components/effects/floating-action-button";
import { BubbleTrail } from "@/components/effects/bubble-trail";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetails from "@/pages/product-details";
import Calculators from "@/pages/calculators";
import FishFinder from "@/pages/fish-finder";
import FishFinderAdvanced from "@/pages/fish-finder-advanced";
import FishEncyclopedia from "@/pages/fish-encyclopedia";
import Deals from "@/pages/deals";
import Wishlist from "@/pages/wishlist";
import SearchResults from "@/pages/search-results";
import CommunityGallery from "@/pages/community-gallery";
import FishHealthDiagnosis from "@/pages/fish-health-diagnosis";
import SubscriptionBoxes from "@/pages/subscription-boxes";
import FishBreedingCalculator from "@/pages/fish-breeding-calculator";
import Sustainability from "@/pages/sustainability";
import FeaturedProduct from "@/pages/products-featured";
import EquipmentDetails from "@/pages/equipment-details";
import EcoFriendlyGuide from "@/pages/guides-eco-friendly";
import ReturnPolicy from "@/pages/return-policy";
import PrivacyPolicy from "@/pages/privacy-policy";
import Terms from "@/pages/terms";
import FAQ from "@/pages/faq";
import OrderTracking from "@/pages/order-tracking";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import Blog from "@/pages/blog";
import Shipping from "@/pages/shipping";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Profile from "@/pages/profile";
import NotFound from "@/pages/404";

// Lazy load heavy pages for better performance
const Journey = lazy(() => import("@/pages/journey"));
const TankBuilder3D = lazy(() => import("@/pages/tank-builder-3d"));
const FishIdentifier = lazy(() => import("@/pages/fish-identifier"));

// Loading component for lazy-loaded pages
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-primary/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">جاري التحميل...</p>
      </div>
    </div>
  );
}

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

      {/* Lazy loaded routes */}
      <Route path="/journey">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <Journey />
          </Suspense>
        )}
      </Route>
      <Route path="/tank-builder-3d">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <TankBuilder3D />
          </Suspense>
        )}
      </Route>
      <Route path="/fish-identifier">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <FishIdentifier />
          </Suspense>
        )}
      </Route>

      <Route path="/fish-finder" component={FishFinder} />
      <Route path="/fish-finder-advanced" component={FishFinderAdvanced} />
      <Route path="/fish-encyclopedia" component={FishEncyclopedia} />
      <Route path="/deals" component={Deals} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/search" component={SearchResults} />
      <Route path="/community-gallery" component={CommunityGallery} />
      <Route path="/fish-health-diagnosis" component={FishHealthDiagnosis} />
      <Route path="/subscription-boxes" component={SubscriptionBoxes} />
      <Route path="/fish-breeding-calculator" component={FishBreedingCalculator} />
      <Route path="/sustainability" component={Sustainability} />
      <Route path="/return-policy" component={ReturnPolicy} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms" component={Terms} />
      <Route path="/faq" component={FAQ} />
      <Route path="/order-tracking" component={OrderTracking} />
      <Route path="/blog" component={Blog} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        {() => (
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              {/* Skip to main content for keyboard navigation */}
              <a href="#main-content" className="skip-to-main">
                الانتقال إلى المحتوى الرئيسي
              </a>
              <ScrollProgress />
              <FloatingActionButton />
              <BubbleTrail />
              <Toaster />
              <Router />
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
