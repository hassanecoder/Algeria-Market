import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, ChevronRight, ChevronLeft, Upload, Smartphone, MapPin, User, ArrowRight, FileText } from "lucide-react";
import { useCreateListing, useGetCategories, useGetBrands, useGetWilayas, type CreateListingRequest } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(5, "Le titre doit faire au moins 5 caractères").max(100),
  description: z.string().min(20, "La description doit faire au moins 20 caractères"),
  price: z.coerce.number().min(1, "Le prix est requis"),
  condition: z.enum(["new", "used", "refurbished"], { required_error: "Sélectionnez l'état" }),
  categoryId: z.coerce.number().min(1, "Sélectionnez une catégorie"),
  brandId: z.coerce.number().min(1, "Sélectionnez une marque"),
  wilayaId: z.coerce.number().min(1, "Sélectionnez une wilaya"),
  sellerName: z.string().min(2, "Votre nom est requis"),
  sellerPhone: z.string().regex(/^(05|06|07)\d{8}$/, "Format invalide (ex: 0555123456)"),
});

type FormValues = z.infer<typeof formSchema>;

export default function PostAd() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { data: categories } = useGetCategories();
  const { data: brands } = useGetBrands();
  const { data: wilayas } = useGetWilayas();
  const { mutate: createListing, isPending } = useCreateListing();

  const { register, handleSubmit, control, trigger, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      condition: "new"
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['categoryId', 'brandId'];
    if (step === 2) fieldsToValidate = ['title', 'description', 'price', 'condition'];
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep(s => s + 1);
  };

  const onSubmit = (data: FormValues) => {
    // Adding dummy images for the demo
    const payload: CreateListingRequest = {
      ...data,
      images: ["https://images.unsplash.com/photo-1598327105666-5b89351cb31b?w=800&h=600&fit=crop"]
    };

    createListing({ data: payload }, {
      onSuccess: () => {
        setIsSuccess(true);
        window.scrollTo(0, 0);
      },
      onError: (err) => {
        console.error("Failed to post ad", err);
        toast({
          title: "Erreur",
          description: "Impossible de publier l'annonce. Vérifiez les informations.",
          variant: "destructive"
        });
      }
    });
  };

  const steps = [
    { id: 1, title: "Catégorie", icon: Smartphone },
    { id: 2, title: "Détails", icon: FileText },
    { id: 3, title: "Contact", icon: User },
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50 dark:bg-background px-4">
        <div className="bg-card p-10 rounded-3xl border border-border shadow-xl max-w-lg w-full text-center text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Félicitations !</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Votre annonce a été publiée avec succès. Elle est maintenant visible par des milliers d'acheteurs.
          </p>
          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={() => setLocation("/listings")} className="w-full text-lg">
              Voir mon annonce
            </Button>
            <Button size="lg" variant="outline" onClick={() => { setIsSuccess(false); setStep(1); }} className="w-full">
              Publier une autre annonce
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold mb-2 text-center">Déposer une annonce</h1>
          <p className="text-muted-foreground text-center">C'est rapide, gratuit et sécurisé.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-border -z-10 -translate-y-1/2" />
          <div 
            className="absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-500" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-background px-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 ${
                step >= s.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-card border-border text-muted-foreground'
              }`}>
                {s.id}
              </div>
              <span className={`text-sm font-medium ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-3xl border border-border shadow-xl shadow-black/5 overflow-hidden">
          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              
              <AnimatePresence mode="wait">
                
                {/* STEP 1: CATEGORY & BRAND */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl font-bold border-b border-border pb-4">Que vendez-vous ?</h2>
                    
                    <div className="space-y-4">
                      <Label className="text-lg">Catégorie</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {categories?.map((cat) => (
                          <label key={cat.id} className="cursor-pointer">
                            <input type="radio" value={cat.id} {...register("categoryId")} className="peer sr-only" />
                            <div className="p-4 rounded-xl border-2 border-border text-center peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50 transition-all">
                              <div className="text-3xl mb-2">{cat.icon || "📱"}</div>
                              <div className="font-semibold text-sm">{cat.name}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.categoryId && <p className="text-destructive text-sm mt-1">{errors.categoryId.message}</p>}
                    </div>

                    <div className="space-y-4">
                      <Label className="text-lg">Marque</Label>
                      <select 
                        {...register("brandId")} 
                        className="w-full p-4 rounded-xl border-2 border-border bg-background focus:border-primary focus:ring-0 outline-none transition-colors"
                      >
                        <option value="">Sélectionnez une marque</option>
                        {brands?.map((brand) => (
                          <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                      </select>
                      {errors.brandId && <p className="text-destructive text-sm mt-1">{errors.brandId.message}</p>}
                    </div>

                    <div className="pt-6 flex justify-end">
                      <Button type="button" size="lg" onClick={nextStep} className="px-8 text-md gap-2">
                        Continuer <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: DETAILS */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold border-b border-border pb-4">Détails de l'annonce</h2>
                    
                    <div className="space-y-2">
                      <Label className="text-base">Titre de l'annonce</Label>
                      <Input 
                        placeholder="Ex: iPhone 13 Pro Max 256Go Noir" 
                        {...register("title")} 
                        className="p-6 text-lg rounded-xl"
                      />
                      {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Prix (DZD)</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          placeholder="Ex: 125000" 
                          {...register("price")} 
                          className="p-6 text-lg rounded-xl pr-16 font-semibold text-primary"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">DZD</span>
                      </div>
                      {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base">État du produit</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {['new', 'used', 'refurbished'].map((cond) => (
                          <label key={cond} className="cursor-pointer">
                            <input type="radio" value={cond} {...register("condition")} className="peer sr-only" />
                            <div className="p-3 text-center rounded-xl border-2 border-border peer-checked:border-primary peer-checked:bg-primary/5 font-medium transition-all">
                              {cond === 'new' ? 'Neuf' : cond === 'used' ? 'Occasion' : 'Reconditionné'}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Description détaillée</Label>
                      <Textarea 
                        placeholder="Décrivez l'état général, les accessoires fournis, si l'appareil a été réparé, etc..." 
                        {...register("description")} 
                        className="p-4 min-h-[150px] rounded-xl resize-y"
                      />
                      {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
                    </div>

                    {/* Image Upload placeholder UI */}
                    <div className="space-y-2 pt-2">
                      <Label className="text-base">Photos (Optionnel)</Label>
                      <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-muted/30">
                        <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                        <p className="font-semibold mb-1">Cliquez pour ajouter des photos</p>
                        <p className="text-sm text-muted-foreground">Format JPG, PNG (Max 5Mo)</p>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-between">
                      <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)} className="gap-2">
                        <ChevronLeft className="w-5 h-5" /> Retour
                      </Button>
                      <Button type="button" size="lg" onClick={nextStep} className="px-8 text-md gap-2">
                        Continuer <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: CONTACT */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold border-b border-border pb-4">Vos coordonnées</h2>
                    
                    <div className="space-y-2">
                      <Label className="text-base">Votre Nom / Pseudo</Label>
                      <Input 
                        placeholder="Ex: Amine" 
                        {...register("sellerName")} 
                        className="p-6 text-lg rounded-xl"
                      />
                      {errors.sellerName && <p className="text-destructive text-sm">{errors.sellerName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Numéro de téléphone</Label>
                      <Input 
                        placeholder="Ex: 0555123456" 
                        {...register("sellerPhone")} 
                        className="p-6 text-lg rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground">Ce numéro sera affiché sur l'annonce et utilisé pour le bouton WhatsApp.</p>
                      {errors.sellerPhone && <p className="text-destructive text-sm">{errors.sellerPhone.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Wilaya</Label>
                      <select 
                        {...register("wilayaId")} 
                        className="w-full p-4 rounded-xl border-2 border-border bg-background focus:border-primary focus:ring-0 outline-none transition-colors"
                      >
                        <option value="">Sélectionnez votre wilaya</option>
                        {wilayas?.map((w) => (
                          <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                        ))}
                      </select>
                      {errors.wilayaId && <p className="text-destructive text-sm">{errors.wilayaId.message}</p>}
                    </div>

                    <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 text-sm text-primary-foreground/80 text-foreground flex gap-3 mt-6">
                      <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                      <p>En publiant cette annonce, vous acceptez nos conditions générales d'utilisation. Votre annonce sera visible immédiatement.</p>
                    </div>

                    <div className="pt-6 flex justify-between">
                      <Button type="button" variant="outline" size="lg" onClick={() => setStep(2)} className="gap-2">
                        <ChevronLeft className="w-5 h-5" /> Retour
                      </Button>
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isPending}
                        className="px-8 text-md gap-2 shadow-lg shadow-primary/30"
                      >
                        {isPending ? "Publication en cours..." : "Publier l'annonce"}
                      </Button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
