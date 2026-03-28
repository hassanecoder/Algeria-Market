import { ShieldCheck, Target, Users, Smartphone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen pt-20">
      
      {/* Hero Banner */}
      <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-secondary flex items-center justify-center text-center">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          {/* using the generated about banner */}
          <img 
            src={`${import.meta.env.BASE_URL}images/about-banner.png`}
            alt="About Dzair-Tech" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 container px-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">À propos de Dzair-Tech</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">La destination numéro 1 en Algérie pour l'achat et la vente de produits high-tech.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Dzair-Tech est né d'un constat simple : il manquait en Algérie une plateforme spécialisée, moderne et sécurisée dédiée exclusivement à la téléphonie mobile et aux accessoires. Notre mission est de connecter les acheteurs et les vendeurs à travers les 58 wilayas, en offrant une expérience utilisateur fluide et transparente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-card p-8 rounded-3xl border border-border text-center shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Spécialisé</h3>
              <p className="text-muted-foreground">Contrairement aux sites généralistes, nous nous concentrons 100% sur la tech pour vous offrir des filtres et caractéristiques pertinents.</p>
            </div>
            
            <div className="bg-card p-8 rounded-3xl border border-border text-center shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sécurisé</h3>
              <p className="text-muted-foreground">Nous modérons les annonces et mettons en place des systèmes de vérification pour limiter les fraudes et assurer votre sécurité.</p>
            </div>

            <div className="bg-card p-8 rounded-3xl border border-border text-center shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Proche de vous</h3>
              <p className="text-muted-foreground">Avec une présence dans les 58 wilayas, trouvez des offres près de chez vous ou vendez vos appareils à vos voisins.</p>
            </div>
          </div>

          <div className="bg-primary text-white rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-20">
              <Smartphone className="w-64 h-64" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 relative z-10">Rejoignez la communauté !</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto relative z-10">
              Que vous cherchiez le dernier iPhone, ou que vous vouliez vendre votre ancienne tablette, Dzair-Tech est l'endroit idéal.
            </p>
            <Link href="/post" className="relative z-10">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg rounded-full shadow-2xl">
                Publier ma première annonce
              </Button>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
