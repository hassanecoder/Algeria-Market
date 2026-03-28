import { useParams, Link } from "wouter";
import { MapPin, Clock, Eye, Phone, ShieldCheck, Tag, Info, ChevronLeft, MessageCircle } from "lucide-react";
import { useGetListingById, useGetListings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ListingCard from "@/components/ListingCard";

export default function ListingDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;
  
  const { data: listing, isLoading, isError } = useGetListingById(id);
  const { data: similarRes } = useGetListings({ 
    categoryId: listing?.categoryId, 
    limit: 4 
  });

  if (isLoading) {
    return <div className="min-h-screen pt-24 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mt-20" /></div>;
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Annonce introuvable</h1>
        <Link href="/listings"><Button>Retour aux annonces</Button></Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
  }).format(listing.price);

  const cleanPhone = listing.seller?.phone?.replace(/^0/, '') || '';
  const whatsappUrl = `https://wa.me/213${cleanPhone}`;

  {/* placeholder image */}
  const mainImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&h=800&fit=crop";

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-muted-foreground">
          <Link href="/listings" className="hover:text-primary flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/listings?categoryId=${listing.categoryId}`} className="hover:text-primary">
            {listing.categoryName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground truncate max-w-[200px]">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Media & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
              <div className="aspect-[4/3] sm:aspect-[16/9] bg-muted relative">
                <img 
                  src={mainImage} 
                  alt={listing.title} 
                  className="w-full h-full object-contain bg-black/5 backdrop-blur-sm"
                />
              </div>
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-card border-t border-border">
                  {listing.images.map((img, i) => (
                    <button key={i} className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all">
                      <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-primary text-white">{listing.condition}</Badge>
                {listing.isFeatured && <Badge variant="secondary" className="bg-amber-100 text-amber-700">Sponsorisé</Badge>}
                <div className="text-muted-foreground text-sm flex items-center gap-4 ml-auto">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(listing.createdAt).toLocaleDateString('fr-FR')}</span>
                  <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {listing.views} vues</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
                {listing.title}
              </h1>
              
              <div className="text-4xl font-display font-black text-primary mb-8">
                {formattedPrice}
              </div>

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-primary" /> Description</h2>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </div>
            </div>

            {/* Specs */}
            {listing.specs && Object.keys(listing.specs).length > 0 && (
              <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Tag className="w-5 h-5 text-primary" /> Caractéristiques</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(listing.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-4 rounded-xl bg-muted/50 border border-border/50">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50 border border-border/50">
                    <span className="text-muted-foreground">Marque</span>
                    <span className="font-semibold">{listing.brandName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Seller & Actions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Seller Card */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-lg shadow-black/5 sticky top-28">
              <h3 className="font-bold text-lg mb-6">Contacter le vendeur</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                  {listing.seller?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-xl">{listing.seller?.name}</h4>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.wilayaName} ({listing.wilayaCode})
                  </div>
                </div>
              </div>

              {listing.seller?.isVerified && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl mb-6 text-sm font-medium border border-emerald-100 dark:border-emerald-800">
                  <ShieldCheck className="w-5 h-5" />
                  Vendeur Vérifié
                </div>
              )}

              <div className="space-y-3 pt-2">
                <a href={`tel:${listing.seller?.phone}`} className="flex items-center justify-center gap-2 w-full p-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <Phone className="w-5 h-5" />
                  Appeler
                </a>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full p-4 bg-[#25D366] text-white rounded-xl font-bold text-lg hover:bg-[#20bd5a] hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex justify-between text-sm text-muted-foreground">
                <span>Membre depuis: {listing.seller?.memberSince}</span>
                <span>{listing.seller?.totalListings} annonces</span>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-3xl p-6 border border-blue-100 dark:border-blue-900/50">
              <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Conseils de sécurité
              </h4>
              <ul className="text-sm text-blue-800/80 dark:text-blue-300/80 space-y-2 list-disc list-inside pl-1">
                <li>Rencontrez le vendeur dans un lieu public.</li>
                <li>Vérifiez l'état de l'appareil avant de payer.</li>
                <li>N'envoyez jamais d'argent à l'avance.</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Similar Listings */}
        {similarRes && similarRes.listings && similarRes.listings.length > 1 && (
          <div className="mt-20 pt-10 border-t border-border">
            <h2 className="text-2xl font-bold mb-8">Annonces Similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarRes.listings.filter(l => l.id !== listing.id).slice(0,4).map(sim => (
                <ListingCard key={sim.id} listing={sim} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
