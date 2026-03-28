import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Filter, SlidersHorizontal, MapPin, X } from "lucide-react";
import { useGetListings, useGetCategories, useGetBrands, useGetWilayas } from "@workspace/api-client-react";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Listings() {
  const [location] = useLocation();
  
  // Parse URL search params for initial state
  const searchParams = new URLSearchParams(window.location.search);
  const initialSearch = searchParams.get('search') || "";
  const initialCat = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;
  const initialBrand = searchParams.get('brandId') ? Number(searchParams.get('brandId')) : undefined;

  // Filter states
  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState<number | undefined>(initialCat);
  const [brandId, setBrandId] = useState<number | undefined>(initialBrand);
  const [wilayaId, setWilayaId] = useState<number | undefined>();
  const [condition, setCondition] = useState<"new" | "used" | "refurbished" | undefined>();
  const [page, setPage] = useState(1);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const { data: categories } = useGetCategories();
  const { data: brands } = useGetBrands();
  const { data: wilayas } = useGetWilayas();

  const { data, isLoading, isError } = useGetListings({
    page,
    limit: 12,
    search: search || undefined,
    categoryId,
    brandId,
    wilayaId,
    condition
  });

  const clearFilters = () => {
    setSearch("");
    setCategoryId(undefined);
    setBrandId(undefined);
    setWilayaId(undefined);
    setCondition(undefined);
    setPage(1);
    // Clear URL params
    window.history.pushState({}, '', '/listings');
  };

  const FiltersContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
          <Filter className="w-4 h-4" /> Recherche
        </h3>
        <Input 
          placeholder="Mot clé..." 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-background"
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Catégorie</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input 
              type="radio" 
              name="cat" 
              checked={categoryId === undefined} 
              onChange={() => { setCategoryId(undefined); setPage(1); }}
              className="accent-primary w-4 h-4"
            />
            <span>Toutes les catégories</span>
          </label>
          {categories?.map(c => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer text-sm">
              <input 
                type="radio" 
                name="cat" 
                checked={categoryId === c.id} 
                onChange={() => { setCategoryId(c.id); setPage(1); }}
                className="accent-primary w-4 h-4"
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">État</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { id: undefined, label: 'Tous' },
            { id: 'new', label: 'Neuf' },
            { id: 'used', label: 'Occasion' },
            { id: 'refurbished', label: 'Reconditionné' }
          ].map(cond => (
            <button
              key={cond.id || 'all'}
              onClick={() => { setCondition(cond.id as any); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                condition === cond.id 
                  ? 'bg-primary text-white font-medium shadow-md' 
                  : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Marque</h3>
        <select 
          className="w-full p-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          value={brandId || ""}
          onChange={(e) => { setBrandId(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
        >
          <option value="">Toutes les marques</option>
          {brands?.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Wilaya
        </h3>
        <select 
          className="w-full p-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          value={wilayaId || ""}
          onChange={(e) => { setWilayaId(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
        >
          <option value="">Toute l'Algérie</option>
          {wilayas?.map(w => (
            <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
          ))}
        </select>
      </div>

      <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={clearFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-background">
      <div className="container mx-auto px-4">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Annonces</h1>
          <Button variant="outline" onClick={() => setShowFiltersMobile(true)} className="gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filtres
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm sticky top-28">
              <FiltersContent />
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {showFiltersMobile && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFiltersMobile(false)} />
              <div className="relative w-[85%] max-w-sm h-full bg-card p-6 overflow-y-auto animate-in slide-in-from-left shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">Filtres</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowFiltersMobile(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <FiltersContent />
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <h1 className="text-3xl font-display font-bold">
                {data?.total ? `${data.total} résultats` : "Recherche..."}
              </h1>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-[380px] bg-card rounded-2xl animate-pulse" />)}
              </div>
            ) : isError ? (
              <div className="p-8 text-center bg-destructive/10 text-destructive rounded-2xl">
                Une erreur est survenue lors du chargement des annonces.
              </div>
            ) : data?.listings && data.listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                  {data.listings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
                
                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                      Précédent
                    </Button>
                    <div className="flex items-center px-4 font-medium">
                      Page {page} sur {data.totalPages}
                    </div>
                    <Button 
                      variant="outline" 
                      disabled={page === data.totalPages}
                      onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-16 bg-card rounded-2xl border border-dashed border-border/60 text-center">
                <Search className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Essayez de modifier vos filtres ou de chercher avec d'autres mots clés.
                </p>
                <Button onClick={clearFilters}>Effacer les filtres</Button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
