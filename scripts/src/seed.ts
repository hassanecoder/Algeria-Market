import { db, wilayasTable, categoriesTable, brandsTable, listingsTable, type InsertListing } from "@workspace/db";
import { sql } from "drizzle-orm";

const wilayas = [
  { code: 1, name: "Adrar", nameAr: "أدرار" },
  { code: 2, name: "Chlef", nameAr: "الشلف" },
  { code: 3, name: "Laghouat", nameAr: "الأغواط" },
  { code: 4, name: "Oum El Bouaghi", nameAr: "أم البواقي" },
  { code: 5, name: "Batna", nameAr: "باتنة" },
  { code: 6, name: "Béjaïa", nameAr: "بجاية" },
  { code: 7, name: "Biskra", nameAr: "بسكرة" },
  { code: 8, name: "Béchar", nameAr: "بشار" },
  { code: 9, name: "Blida", nameAr: "البليدة" },
  { code: 10, name: "Bouira", nameAr: "البويرة" },
  { code: 11, name: "Tamanrasset", nameAr: "تمنراست" },
  { code: 12, name: "Tébessa", nameAr: "تبسة" },
  { code: 13, name: "Tlemcen", nameAr: "تلمسان" },
  { code: 14, name: "Tiaret", nameAr: "تيارت" },
  { code: 15, name: "Tizi Ouzou", nameAr: "تيزي وزو" },
  { code: 16, name: "Alger", nameAr: "الجزائر" },
  { code: 17, name: "Djelfa", nameAr: "الجلفة" },
  { code: 18, name: "Jijel", nameAr: "جيجل" },
  { code: 19, name: "Sétif", nameAr: "سطيف" },
  { code: 20, name: "Saïda", nameAr: "سعيدة" },
  { code: 21, name: "Skikda", nameAr: "سكيكدة" },
  { code: 22, name: "Sidi Bel Abbès", nameAr: "سيدي بلعباس" },
  { code: 23, name: "Annaba", nameAr: "عنابة" },
  { code: 24, name: "Guelma", nameAr: "قالمة" },
  { code: 25, name: "Constantine", nameAr: "قسنطينة" },
  { code: 26, name: "Médéa", nameAr: "المدية" },
  { code: 27, name: "Mostaganem", nameAr: "مستغانم" },
  { code: 28, name: "M'Sila", nameAr: "المسيلة" },
  { code: 29, name: "Mascara", nameAr: "معسكر" },
  { code: 30, name: "Ouargla", nameAr: "ورقلة" },
  { code: 31, name: "Oran", nameAr: "وهران" },
  { code: 32, name: "El Bayadh", nameAr: "البيض" },
  { code: 33, name: "Illizi", nameAr: "إليزي" },
  { code: 34, name: "Bordj Bou Arréridj", nameAr: "برج بوعريريج" },
  { code: 35, name: "Boumerdès", nameAr: "بومرداس" },
  { code: 36, name: "El Tarf", nameAr: "الطارف" },
  { code: 37, name: "Tindouf", nameAr: "تندوف" },
  { code: 38, name: "Tissemsilt", nameAr: "تيسمسيلت" },
  { code: 39, name: "El Oued", nameAr: "الوادي" },
  { code: 40, name: "Khenchela", nameAr: "خنشلة" },
  { code: 41, name: "Souk Ahras", nameAr: "سوق أهراس" },
  { code: 42, name: "Tipaza", nameAr: "تيبازة" },
  { code: 43, name: "Mila", nameAr: "ميلة" },
  { code: 44, name: "Aïn Defla", nameAr: "عين الدفلى" },
  { code: 45, name: "Naâma", nameAr: "النعامة" },
  { code: 46, name: "Aïn Témouchent", nameAr: "عين تيموشنت" },
  { code: 47, name: "Ghardaïa", nameAr: "غرداية" },
  { code: 48, name: "Relizane", nameAr: "غليزان" },
  { code: 49, name: "Timimoun", nameAr: "تيميمون" },
  { code: 50, name: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار" },
  { code: 51, name: "Ouled Djellal", nameAr: "أولاد جلال" },
  { code: 52, name: "Béni Abbès", nameAr: "بني عباس" },
  { code: 53, name: "In Salah", nameAr: "عين صالح" },
  { code: 54, name: "In Guezzam", nameAr: "عين قزام" },
  { code: 55, name: "Touggourt", nameAr: "تقرت" },
  { code: 56, name: "Djanet", nameAr: "جانت" },
  { code: 57, name: "El M'Ghair", nameAr: "المغير" },
  { code: 58, name: "El Meniaa", nameAr: "المنيعة" },
];

const categories = [
  { name: "Smartphones", nameAr: "هواتف ذكية", slug: "smartphones", icon: "📱" },
  { name: "Tablettes", nameAr: "أجهزة لوحية", slug: "tablettes", icon: "💻" },
  { name: "Accessoires", nameAr: "إكسسوارات", slug: "accessoires", icon: "🔌" },
  { name: "Écouteurs & Casques", nameAr: "سماعات", slug: "ecouteurs", icon: "🎧" },
  { name: "Montres connectées", nameAr: "ساعات ذكية", slug: "montres-connectees", icon: "⌚" },
  { name: "Chargeurs & Câbles", nameAr: "شواحن وكابلات", slug: "chargeurs", icon: "🔋" },
  { name: "Coques & Protection", nameAr: "أغطية وحماية", slug: "coques", icon: "🛡️" },
  { name: "Gaming Mobile", nameAr: "ألعاب الجوال", slug: "gaming", icon: "🎮" },
];

const brands = [
  { name: "Samsung", slug: "samsung", logo: "https://logo.clearbit.com/samsung.com" },
  { name: "Apple", slug: "apple", logo: "https://logo.clearbit.com/apple.com" },
  { name: "Xiaomi", slug: "xiaomi", logo: "https://logo.clearbit.com/xiaomi.com" },
  { name: "Huawei", slug: "huawei", logo: "https://logo.clearbit.com/huawei.com" },
  { name: "Oppo", slug: "oppo", logo: "https://logo.clearbit.com/oppo.com" },
  { name: "Vivo", slug: "vivo", logo: "https://logo.clearbit.com/vivo.com" },
  { name: "Realme", slug: "realme", logo: "https://logo.clearbit.com/realme.com" },
  { name: "Honor", slug: "honor", logo: "https://logo.clearbit.com/honor.com" },
  { name: "Tecno", slug: "tecno", logo: "https://logo.clearbit.com/tecno-mobile.com" },
  { name: "Infinix", slug: "infinix", logo: "https://logo.clearbit.com/infinixmobility.com" },
  { name: "Nothing", slug: "nothing", logo: "https://logo.clearbit.com/nothing.tech" },
  { name: "OnePlus", slug: "oneplus", logo: "https://logo.clearbit.com/oneplus.com" },
];

const phoneImages = [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
  "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
  "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400",
  "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400",
  "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
  "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400",
];

const accessoryImages = [
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
];

async function seed() {
  const seedMode = process.env.SEED_MODE === "bootstrap" ? "bootstrap" : "reset";
  console.log(`🌱 Starting seed in ${seedMode} mode...`);

  if (seedMode === "bootstrap") {
    const existing = await db.select().from(listingsTable).limit(1);
    if (existing.length > 0) {
      console.log("Bootstrap seed skipped; listings already present");
      return;
    }
  }

  if (seedMode === "reset") {
    await db.execute(sql`TRUNCATE TABLE listings, brands, categories, wilayas RESTART IDENTITY CASCADE`);
  }

  console.log("📍 Inserting wilayas...");
  await db.insert(wilayasTable).values(wilayas);

  console.log("📂 Inserting categories...");
  await db.insert(categoriesTable).values(categories);

  console.log("🏷️ Inserting brands...");
  await db.insert(brandsTable).values(brands);

  const allWilayas = await db.select().from(wilayasTable);
  const allCategories = await db.select().from(categoriesTable);
  const allBrands = await db.select().from(brandsTable);

  const getWilaya = (name: string) => allWilayas.find(w => w.name === name)!;
  const getCategory = (slug: string) => allCategories.find(c => c.slug === slug)!;
  const getBrand = (slug: string) => allBrands.find(b => b.slug === slug)!;

  console.log("📱 Inserting listings...");
  const listings: InsertListing[] = [
    {
      title: "Samsung Galaxy S24 Ultra - Neuf sous blister",
      description: "Samsung Galaxy S24 Ultra 512GB Titanium Black, jamais utilisé, sous blister d'usine. Livré avec tous les accessoires d'origine. Garantie 1 an. Possibilité de livraison dans tout Alger.",
      price: "285000",
      condition: "new",
      images: [phoneImages[0], phoneImages[1]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("samsung").id,
      wilayaId: getWilaya("Alger").id,
      specs: { RAM: "12 GB", Stockage: "512 GB", Écran: "6.8 pouces Dynamic AMOLED", Processeur: "Snapdragon 8 Gen 3", Batterie: "5000 mAh", Caméra: "200 MP" },
      sellerName: "Karim Boumediene",
      sellerPhone: "0661234567",
      isFeatured: true,
    },
    {
      title: "iPhone 15 Pro Max 256GB Titanium Natural",
      description: "iPhone 15 Pro Max 256GB, couleur Titanium Natural. Acheté en France, avec facture. Téléphone en excellent état, utilisé 3 mois. Boîte complète avec chargeur USB-C. Apple Care jusqu'en 2025.",
      price: "320000",
      condition: "used",
      images: [phoneImages[2], phoneImages[3]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("apple").id,
      wilayaId: getWilaya("Oran").id,
      specs: { RAM: "8 GB", Stockage: "256 GB", Écran: "6.7 pouces Super Retina XDR", Processeur: "Apple A17 Pro", Batterie: "4422 mAh", Caméra: "48 MP Triple" },
      sellerName: "Amina Rahmani",
      sellerPhone: "0555678901",
      isFeatured: true,
    },
    {
      title: "Xiaomi 14 Pro - Double SIM - 512GB",
      description: "Xiaomi 14 Pro 12GB/512GB noir, importé officiellement. Occasion propre, sans égratignure. Boîte avec tous les accessoires. Testé et parfait.",
      price: "195000",
      condition: "used",
      images: [phoneImages[4], phoneImages[5]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("xiaomi").id,
      wilayaId: getWilaya("Constantine").id,
      specs: { RAM: "12 GB", Stockage: "512 GB", Écran: "6.73 pouces LTPO AMOLED", Processeur: "Snapdragon 8 Gen 3", Batterie: "4880 mAh", Caméra: "50 MP Leica Triple" },
      sellerName: "Youcef Mansouri",
      sellerPhone: "0771234567",
      isFeatured: true,
    },
    {
      title: "Samsung Galaxy A55 5G - 256GB - Neuf",
      description: "Samsung Galaxy A55 5G 256GB, couleur Awesome Iceblue. Neuf sous blister. Garantie Samsung Algérie 2 ans. Prix négociable. Disponible en plusieurs couleurs.",
      price: "89000",
      condition: "new",
      images: [phoneImages[6]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("samsung").id,
      wilayaId: getWilaya("Sétif").id,
      specs: { RAM: "8 GB", Stockage: "256 GB", Écran: "6.6 pouces Super AMOLED", Processeur: "Exynos 1480", Batterie: "5000 mAh", Caméra: "50 MP" },
      sellerName: "Mourad Bensalem",
      sellerPhone: "0662345678",
      isFeatured: false,
    },
    {
      title: "Huawei P60 Pro - 256GB - Occasion",
      description: "Huawei P60 Pro 8GB/256GB, couleur Rococo Pearl. En très bon état, utilisé avec coque et verre trempé depuis le premier jour. Pas d'égratignures sur l'écran.",
      price: "155000",
      condition: "used",
      images: [phoneImages[7]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("huawei").id,
      wilayaId: getWilaya("Blida").id,
      specs: { RAM: "8 GB", Stockage: "256 GB", Écran: "6.67 pouces OLED", Processeur: "Snapdragon 8+ Gen 1", Batterie: "4815 mAh", Caméra: "48 MP Leica Variable Aperture" },
      sellerName: "Fatima Zohra",
      sellerPhone: "0553456789",
      isFeatured: true,
    },
    {
      title: "Oppo Find X7 Ultra - 512GB - Neuf",
      description: "Oppo Find X7 Ultra 16GB/512GB, neuf importé de Chine. Boîte complète. Hassel Blad camera system. Le meilleur appareil photo de sa génération.",
      price: "245000",
      condition: "new",
      images: [phoneImages[0]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("oppo").id,
      wilayaId: getWilaya("Annaba").id,
      specs: { RAM: "16 GB", Stockage: "512 GB", Écran: "6.82 pouces LTPO AMOLED", Processeur: "Snapdragon 8 Gen 3", Batterie: "5000 mAh", Caméra: "50 MP Hasselblad Quad" },
      sellerName: "Salim Hadj",
      sellerPhone: "0664567890",
      isFeatured: false,
    },
    {
      title: "Realme GT 5 Pro - 256GB - Neuf",
      description: "Realme GT 5 Pro 16GB/256GB sous blister. Snapdragon 8 Gen 3 pour un prix abordable. Chargeur 100W inclus. Très bon rapport qualité/prix.",
      price: "115000",
      condition: "new",
      images: [phoneImages[1]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("realme").id,
      wilayaId: getWilaya("Tizi Ouzou").id,
      specs: { RAM: "16 GB", Stockage: "256 GB", Écran: "6.78 pouces LTPO AMOLED", Processeur: "Snapdragon 8 Gen 3", Batterie: "5400 mAh", Caméra: "50 MP Sony IMX890 Triple" },
      sellerName: "Djamel Aoudjit",
      sellerPhone: "0775678901",
      isFeatured: false,
    },
    {
      title: "Honor Magic6 Pro - 512GB - Occasion",
      description: "Honor Magic6 Pro 12GB/512GB, en parfait état. Écran très lumineux, batterie excellente. Livré avec boîte, chargeur 80W et câble. Testé et fonctionnel à 100%.",
      price: "168000",
      condition: "used",
      images: [phoneImages[2]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("honor").id,
      wilayaId: getWilaya("Béjaïa").id,
      specs: { RAM: "12 GB", Stockage: "512 GB", Écran: "6.8 pouces LTPO OLED", Processeur: "Snapdragon 8 Gen 3", Batterie: "5600 mAh", Caméra: "50 MP Triple Periskope" },
      sellerName: "Nassim Boudali",
      sellerPhone: "0556789012",
      isFeatured: false,
    },
    {
      title: "AirPods Pro 2ème génération - Neuf",
      description: "Apple AirPods Pro 2nd Generation avec boîtier MagSafe USB-C. Neufs, jamais utilisés. Annulation de bruit active de qualité supérieure. Livrés avec toutes les embouts.",
      price: "38000",
      condition: "new",
      images: [accessoryImages[0], accessoryImages[1]],
      categoryId: getCategory("ecouteurs").id,
      brandId: getBrand("apple").id,
      wilayaId: getWilaya("Alger").id,
      specs: { Type: "Intra-auriculaire sans fil", ANC: "Oui - Active Noise Cancellation", Autonomie: "6h (30h avec boîtier)", Connexion: "Bluetooth 5.3", Résistance: "IPX4", Compatibilité: "iOS/Android" },
      sellerName: "Rania Belhaj",
      sellerPhone: "0661111222",
      isFeatured: true,
    },
    {
      title: "Samsung Galaxy Watch 6 Classic 47mm",
      description: "Samsung Galaxy Watch 6 Classic 47mm, couleur Black. Neuve sous blister. Lunette tournante, ECG, tension artérielle. Compatible Android. Garantie Samsung Algérie.",
      price: "65000",
      condition: "new",
      images: [accessoryImages[2]],
      categoryId: getCategory("montres-connectees").id,
      brandId: getBrand("samsung").id,
      wilayaId: getWilaya("Tipaza").id,
      specs: { Taille: "47mm", Écran: "1.47 pouces Super AMOLED", Batterie: "425 mAh", GPS: "Oui - Multi", Santé: "ECG, Tension, SpO2", OS: "Wear OS" },
      sellerName: "Hocine Kaci",
      sellerPhone: "0778888999",
      isFeatured: false,
    },
    {
      title: "Chargeur rapide 65W GaN - Universel",
      description: "Chargeur GaN 65W USB-C + USB-A, compatible avec tous les smartphones et laptops. Charge rapide PD 3.0 et QC 4+. Très compact, idéal pour les voyages.",
      price: "4500",
      condition: "new",
      images: [accessoryImages[3]],
      categoryId: getCategory("chargeurs").id,
      brandId: getBrand("xiaomi").id,
      wilayaId: getWilaya("Oran").id,
      specs: { Puissance: "65W", Ports: "2 USB-C + 1 USB-A", Technologie: "GaN", Compatibilité: "PD 3.0, QC 4+", Dimensions: "38x38x38mm" },
      sellerName: "Sofiane Lounis",
      sellerPhone: "0552222333",
      isFeatured: false,
    },
    {
      title: "Coque iPhone 15 Pro Max - Magsafe Compatible",
      description: "Coque premium MagSafe pour iPhone 15 Pro Max, en polycarbonate transparent avec protection coins renforcés. Compatible chargeur MagSafe. Vendu lot de 3 coques différentes.",
      price: "3200",
      condition: "new",
      images: [accessoryImages[0]],
      categoryId: getCategory("coques").id,
      brandId: getBrand("apple").id,
      wilayaId: getWilaya("Batna").id,
      specs: { Compatibilité: "iPhone 15 Pro Max", Matière: "Polycarbonate + TPU", MagSafe: "Oui", Protection: "Military Grade", Couleur: "Transparent" },
      sellerName: "Meriem Chaoui",
      sellerPhone: "0663333444",
      isFeatured: false,
    },
    {
      title: "Xiaomi Redmi Note 13 Pro+ - 256GB - Neuf",
      description: "Xiaomi Redmi Note 13 Pro+ 12GB/256GB Fusion White. Neuf sous blister, importé officiel. Écran AMOLED 120Hz, Charge rapide 120W, Caméra 200MP. Excellent rapport qualité/prix.",
      price: "58000",
      condition: "new",
      images: [phoneImages[3]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("xiaomi").id,
      wilayaId: getWilaya("Mostaganem").id,
      specs: { RAM: "12 GB", Stockage: "256 GB", Écran: "6.67 pouces AMOLED 120Hz", Processeur: "Dimensity 7200 Ultra", Batterie: "5000 mAh", Caméra: "200 MP" },
      sellerName: "Hamid Cherif",
      sellerPhone: "0774444555",
      isFeatured: false,
    },
    {
      title: "Tecno Camon 30 Premier - 512GB - Neuf",
      description: "Tecno Camon 30 Premier 5G 16GB/512GB neuf. Appareil photo principal 50MP avec intelligence artificielle. Écran courbe 144Hz. Parfait pour la photo et les réseaux sociaux.",
      price: "72000",
      condition: "new",
      images: [phoneImages[4]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("tecno").id,
      wilayaId: getWilaya("Mascara").id,
      specs: { RAM: "16 GB", Stockage: "512 GB", Écran: "6.77 pouces AMOLED 144Hz", Processeur: "Dimensity 8200", Batterie: "5000 mAh", Caméra: "50 MP AI Triple" },
      sellerName: "Amar Berrabah",
      sellerPhone: "0655555666",
      isFeatured: false,
    },
    {
      title: "Samsung Galaxy Tab S9+ - 512GB - Occasion",
      description: "Samsung Galaxy Tab S9+ 12GB/512GB Beige, utilisée 6 mois avec S Pen inclus. Parfaite pour le travail et le divertissement. Boîte complète avec chargeur 45W.",
      price: "145000",
      condition: "used",
      images: [accessoryImages[1]],
      categoryId: getCategory("tablettes").id,
      brandId: getBrand("samsung").id,
      wilayaId: getWilaya("Boumerdès").id,
      specs: { RAM: "12 GB", Stockage: "512 GB", Écran: "12.4 pouces Dynamic AMOLED 2X 120Hz", Processeur: "Snapdragon 8 Gen 2", Batterie: "10090 mAh", "S Pen": "Inclus" },
      sellerName: "Lydia Idir",
      sellerPhone: "0556666777",
      isFeatured: true,
    },
    {
      title: "Nothing Phone (2) - 256GB - Blanc",
      description: "Nothing Phone 2 12GB/256GB White, en excellent état. Design unique avec Glyph Interface. Imported from UK. Boîte originale avec tous les accessoires.",
      price: "98000",
      condition: "used",
      images: [phoneImages[5]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("nothing").id,
      wilayaId: getWilaya("Médéa").id,
      specs: { RAM: "12 GB", Stockage: "256 GB", Écran: "6.7 pouces LTPO OLED 120Hz", Processeur: "Snapdragon 8+ Gen 1", Batterie: "4700 mAh", Design: "Glyph Interface LED" },
      sellerName: "Ismail Dib",
      sellerPhone: "0777777888",
      isFeatured: false,
    },
    {
      title: "OnePlus 12 - 512GB - Silky Black",
      description: "OnePlus 12 16GB/512GB Silky Black. Neuf importé, boîte scellée. Hasselblad tuned camera, charge rapide 100W Supervooc. Le flagship killer par excellence.",
      price: "175000",
      condition: "new",
      images: [phoneImages[6]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("oneplus").id,
      wilayaId: getWilaya("Tlemcen").id,
      specs: { RAM: "16 GB", Stockage: "512 GB", Écran: "6.82 pouces LTPO AMOLED 120Hz", Processeur: "Snapdragon 8 Gen 3", Batterie: "5400 mAh", Caméra: "50 MP Hasselblad Triple" },
      sellerName: "Walid Touati",
      sellerPhone: "0558888999",
      isFeatured: false,
    },
    {
      title: "Vivo X100 Pro - 256GB - Neuf",
      description: "Vivo X100 Pro 16GB/256GB, neuf importé. Zeiss camera optics, 5G ultra rapide. Chargeur FlashCharge 100W et charge sans fil 50W. Design premium en verre.",
      price: "218000",
      condition: "new",
      images: [phoneImages[7]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("vivo").id,
      wilayaId: getWilaya("Biskra").id,
      specs: { RAM: "16 GB", Stockage: "256 GB", Écran: "6.78 pouces AMOLED LTPO 120Hz", Processeur: "Dimensity 9300", Batterie: "5400 mAh", Caméra: "50 MP Zeiss APO Triple" },
      sellerName: "Brahim Slimane",
      sellerPhone: "0669999000",
      isFeatured: false,
    },
    {
      title: "Samsung Galaxy S23 FE - 256GB - Reconditionné",
      description: "Samsung Galaxy S23 FE 8GB/256GB Graphite reconditionné grade A+. Reconditionnement professionnel, batterie à 98%. Livré avec housse et verre trempé. Garantie 6 mois.",
      price: "62000",
      condition: "refurbished",
      images: [phoneImages[0]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("samsung").id,
      wilayaId: getWilaya("Sétif").id,
      specs: { RAM: "8 GB", Stockage: "256 GB", Écran: "6.4 pouces Dynamic AMOLED 120Hz", Processeur: "Exynos 2200", Batterie: "4500 mAh", Caméra: "50 MP Triple" },
      sellerName: "Toufik Messaoudi",
      sellerPhone: "0770000111",
      isFeatured: false,
    },
    {
      title: "Infinix Zero 30 5G - 256GB - Neuf",
      description: "Infinix Zero 30 5G 8GB/256GB Fantasy Purple. Neuf sous blister. Écran incurvé AMOLED 144Hz. Charge rapide 68W. L'alliance parfaite entre style et performance.",
      price: "42000",
      condition: "new",
      images: [phoneImages[1]],
      categoryId: getCategory("smartphones").id,
      brandId: getBrand("infinix").id,
      wilayaId: getWilaya("Tiaret").id,
      specs: { RAM: "8 GB", Stockage: "256 GB", Écran: "6.78 pouces AMOLED 144Hz", Processeur: "Dimensity 8020", Batterie: "5000 mAh", Caméra: "108 MP Triple" },
      sellerName: "Zineb Moussaoui",
      sellerPhone: "0551111222",
      isFeatured: false,
    },
  ];

  await db.insert(listingsTable).values(listings);

  console.log("✅ Seed completed successfully!");
  console.log(`  - ${wilayas.length} wilayas`);
  console.log(`  - ${categories.length} categories`);
  console.log(`  - ${brands.length} brands`);
  console.log(`  - ${listings.length} listings`);

  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
