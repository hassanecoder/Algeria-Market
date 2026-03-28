import { Link } from "wouter";
import { Smartphone, Facebook, Instagram, Twitter, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t border-border/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group shrink-0 inline-flex">
              <div className="bg-primary text-white p-2 rounded-xl">
                <Smartphone size={24} strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Dzair<span className="text-primary">-Tech</span>
              </span>
            </Link>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed max-w-xs">
              Le premier marché dédié exclusivement aux téléphones et accessoires high-tech en Algérie. Vendez, achetez, échangez en toute sécurité.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary hover:text-white transition-colors"><Instagram size={18} /></a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary hover:text-white transition-colors"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg text-white mb-4">Liens Rapides</h3>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li><Link href="/listings" className="hover:text-primary transition-colors">Toutes les annonces</Link></li>
              <li><Link href="/post" className="hover:text-primary transition-colors">Vendre un téléphone</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">À propos de nous</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Boutiques officielles</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-lg text-white mb-4">Catégories</h3>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li><Link href="/listings?category=smartphones" className="hover:text-primary transition-colors">Smartphones</Link></li>
              <li><Link href="/listings?category=tablets" className="hover:text-primary transition-colors">Tablettes</Link></li>
              <li><Link href="/listings?category=accessories" className="hover:text-primary transition-colors">Accessoires</Link></li>
              <li><Link href="/listings?category=smartwatches" className="hover:text-primary transition-colors">Smartwatches</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg text-white mb-4">Contact</h3>
            <ul className="space-y-4 text-sm text-secondary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Alger Centre, Alger<br/>Algérie, 16000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span dir="ltr">+213 555 12 34 56</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>contact@dzair-tech.dz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary-foreground/50">
          <p>© {new Date().getFullYear()} Dzair-Tech (دزير-تك). Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
