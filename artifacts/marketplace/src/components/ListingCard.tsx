import { Link } from "wouter";
import { MapPin, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Listing } from "@workspace/api-client-react";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  // Format price in DZD
  const formattedPrice = new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
  }).format(listing.price);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'used': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'refurbished': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'new': return 'Neuf';
      case 'used': return 'Occasion';
      case 'refurbished': return 'Reconditionné';
      default: return condition;
    }
  };

  // Fallback image if none provided
  {/* tech gadget placeholder */}
  const mainImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop";

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="group flex flex-col h-full bg-card rounded-2xl border border-border/50 overflow-hidden card-hover cursor-pointer">
        
        {/* Image Area */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden shrink-0">
          <img 
            src={mainImage} 
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {listing.isFeatured && (
              <Badge className="bg-primary text-primary-foreground shadow-md shadow-primary/20 border-none px-2 py-0.5 font-semibold">
                Sponsorisé
              </Badge>
            )}
            <Badge variant="outline" className={`backdrop-blur-md bg-white/90 shadow-sm ${getConditionColor(listing.condition)}`}>
              {getConditionLabel(listing.condition)}
            </Badge>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground line-clamp-2 text-sm sm:text-base leading-snug group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
          </div>

          <div className="font-display font-bold text-lg sm:text-xl text-primary mb-auto">
            {formattedPrice}
          </div>

          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{listing.wilayaCode} - {listing.wilayaName}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{new Date(listing.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{listing.views}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
