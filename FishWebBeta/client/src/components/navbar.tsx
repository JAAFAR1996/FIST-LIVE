import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, Fish, Calculator, Home, Package, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/products", label: "المنتجات", icon: Package },
    { href: "/calculators", label: "الحاسبات", icon: Calculator },
    { href: "/journey", label: "رحلتك", icon: Fish },
    { href: "/fish-finder", label: "مكتشف الأسماك", icon: SearchIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
                    <span className={`flex items-center gap-3 text-lg px-4 py-2 rounded-md transition-colors ${
                      location === link.href ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                    }`}>
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-primary/10 p-2 rounded-full group-hover:animate-pulse">
              <Fish className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-primary to-blue-600 group-hover:to-purple-500 transition-all">
              Fish Web
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer flex items-center gap-2 ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}>
                {link.icon && <link.icon className="h-4 w-4 opacity-50" />}
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitcher />
          
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
