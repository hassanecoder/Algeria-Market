import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Search, ArrowRight, Tag, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ListingCard from "@/components/ListingCard";
import { useGetFeaturedListings, useGetListings, useGetCategories, useGetBrands } from "@workspace/api-client-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: featured, isLoading: isLoadingFeatured } = useGetFeaturedListings();
  const { data: recentRes, isLoading: isLoadingRecent } = useGetListings({ limit: 8 });
  const { data: categories } = useGetCategories();
  const { data: brands } = useGetBrands();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-secondary">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-tech-bg.png`}
            alt="Hero Tech Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-20 sm:py-32 flex flex-col items-center text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 px-4 py-1.5 text-sm">
            Numéro 1 de la Tech en Algérie 🇩🇿
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white max-w-4xl tracking-tight leading-tight mb-6">
            Achetez et Vendez vos <span className="text-primary">Smartphones</span> en toute simplicité
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mb-10">
            Découvrez des milliers d'annonces de téléphones, tablettes et accessoires neufs ou d'occasion dans toutes les wilayas.
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl relative flex items-center">
            <div className="absolute left-4 text-muted-foreground">
              <Search className="w-6 h-6" />
            </div>
            <Input 
              type="text"
              placeholder="Chercher un iPhone 15, Galaxy S24, AirPods..."
              className="w-full pl-12 pr-32 py-8 text-lg rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-500 transition-all shadow-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              size="lg" 
              className="absolute right-2 top-2 bottom-2 rounded-xl px-8 text-md shadow-md"
            >
              Rechercher
            </Button>
          </form>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Catégories Populaires</h2>
            <Link href="/listings" className="text-primary font-medium flex items-center hover:underline">
              Voir tout <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories?.slice(0, 6).map((cat) => (
              <Link 
                key={cat.id} 
                href={`/listings?categoryId=${cat.id}`}
                className="group flex flex-col items-center justify-center p-6 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition-colors text-3xl">
                  {cat.icon || "📱"}
                </div>
                <span className="font-semibold text-center">{cat.name}</span>
                <span className="text-xs text-muted-foreground mt-1">{cat.listingCount || 0} annonces</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SECTION */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold">Annonces Sponsorisées</h2>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-[350px] bg-card rounded-2xl animate-pulse" />)}
            </div>
          ) : featured && featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 4).map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune annonce sponsorisée pour le moment.</p>
          )}
        </div>
      </section>

      {/* BRANDS BANNER */}
      <section className="py-12 border-y border-border overflow-hidden bg-background">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Les marques les plus recherchées</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            {brands?.slice(0, 8).map(brand => (
              <Link key={brand.id} href={`/listings?brandId=${brand.id}`} className="hover:opacity-100 transition-opacity flex items-center gap-2">
                <span className="font-display font-bold text-xl">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT LISTINGS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Dernières Annonces</h2>
            <Link href="/listings" className="text-primary font-medium flex items-center hover:underline">
              Tout parcourir <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {isLoadingRecent ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-[350px] bg-card rounded-2xl animate-pulse" />)}
            </div>
          ) : recentRes?.listings && recentRes.listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentRes.listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
              <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune annonce</h3>
              <p className="text-muted-foreground mb-6">Soyez le premier à publier une annonce !</p>
              <Link href="/post">
                <Button>Déposer une annonce</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-white" />
          <h2 className="font-display text-4xl font-bold mb-6">Prêt à vendre votre téléphone ?</h2>
          <p className="text-xl text-white/90 mb-10">
            Rejoignez des milliers d'Algériens qui utilisent Dzair-Tech au quotidien. 
            La publication d'une annonce prend moins de 2 minutes et c'est 100% gratuit !
          </p>
          <Link href="/post">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-6 rounded-full shadow-2xl hover:scale-105 transition-transform">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>
      
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`inline-flex items-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>
}
