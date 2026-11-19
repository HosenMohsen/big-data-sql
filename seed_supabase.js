  import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zluyajawlefypnsgzeqx.supabase.co';
const supabaseKey = 'sb_publishable_glAkrvjzdvbRAm_-Qkmmfw_wUl17zJR';

const supabase = createClient(supabaseUrl, supabaseKey);

// Données de base
const firstNames = ["Alexandre", "Thomas", "Nicolas", "Julien", "Lucas", "Maxime", "Antoine", "Clément", "Romain", "Guillaume",
  "Camille", "Léa", "Manon", "Chloé", "Emma", "Sarah", "Inès", "Jade", "Louise", "Alice",
  "Mohamed", "Yassine", "Amine", "Karim", "Mehdi", "Fatima", "Nour", "Samira", "Sofia", "Kenzo",
  "David", "Michael", "Kevin", "Florian", "Sébastien", "Laura", "Marie", "Pauline", "Julie", "Anaïs",
  "Hugo", "Arthur", "Gabriel", "Raphaël", "Louis", "Jules", "Adam", "Liam", "Noah", "Paul",
  "Elise", "Théo", "Yasmine", "Baptiste", "Margaux"];

const lastNames = ["Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand", "Leroy", "Moreau",
  "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier",
  "Morel", "Girard", "Andre", "Lefevre", "Mercier", "Dupont", "Lambert", "Bonnet", "Francois", "Martinez",
  "Legrand", "Garnier", "Faure", "Rousseau", "Blanc", "Guerin", "Muller", "Henry", "Roussel", "Nicolas",
  "Perrin", "Morin", "Mathieu", "Clement", "Gauthier", "Dumont", "Lopez", "Fontaine", "Chevalier", "Robin",
  "Masson", "Renard", "Barbier", "Arnaud", "Picard"];

// Nombre de clients : au moins 55, et chacun a au moins une commande
const NB_USERS = 55;

// Données géographiques cohérentes par pays (villes + codes postaux, rues, indicatif téléphonique)
// "poids" = probabilité relative d'apparition (la France reste majoritaire)
const countriesData = {
  "France": {
    poids: 40,
    indicatif: "+33 6",
    cities: [["Paris", "75001"], ["Paris", "75011"], ["Lyon", "69002"], ["Marseille", "13001"],
      ["Toulouse", "31000"], ["Bordeaux", "33000"], ["Nantes", "44000"], ["Lille", "59000"],
      ["Strasbourg", "67000"], ["Rennes", "35000"], ["Montpellier", "34000"], ["Nice", "06000"]],
    streets: ["rue de la Paix", "avenue des Champs-Élysées", "boulevard Haussmann", "rue Nationale",
      "rue de la République", "cours Mirabeau", "avenue Jean Jaurès", "rue Victor Hugo",
      "rue Saint-Honoré", "boulevard Saint-Germain", "rue Garibaldi", "rue Paradis"]
  },
  "Belgique": {
    poids: 8,
    indicatif: "+32 4",
    cities: [["Bruxelles", "1000"], ["Liège", "4000"], ["Namur", "5000"], ["Charleroi", "6000"], ["Gand", "9000"], ["Anvers", "2000"]],
    streets: ["rue Neuve", "avenue Louise", "rue de la Loi", "boulevard d'Avroy", "rue de Fer", "Meir"]
  },
  "Suisse": {
    poids: 7,
    indicatif: "+41 7",
    cities: [["Genève", "1201"], ["Lausanne", "1003"], ["Zurich", "8001"], ["Berne", "3011"], ["Bâle", "4051"], ["Neuchâtel", "2000"]],
    streets: ["rue du Rhône", "rue de Bourg", "Bahnhofstrasse", "Marktgasse", "Freie Strasse", "rue du Seyon"]
  },
  "Canada": {
    poids: 7,
    indicatif: "+1 514",
    cities: [["Montréal", "H2X 1Y4"], ["Québec", "G1R 4P5"], ["Toronto", "M5V 2T6"], ["Vancouver", "V6B 1A1"], ["Ottawa", "K1P 5J2"], ["Laval", "H7N 2Y5"]],
    streets: ["rue Sainte-Catherine", "boulevard Saint-Laurent", "rue Saint-Jean", "Queen Street", "Robson Street", "rue Sparks"]
  },
  "Espagne": {
    poids: 7,
    indicatif: "+34 6",
    cities: [["Madrid", "28013"], ["Barcelone", "08002"], ["Valence", "46002"], ["Séville", "41004"], ["Bilbao", "48001"], ["Malaga", "29015"]],
    streets: ["Gran Vía", "calle Mayor", "Paseo de Gracia", "calle de Alcalá", "La Rambla", "calle Larios"]
  },
  "Italie": {
    poids: 7,
    indicatif: "+39 3",
    cities: [["Rome", "00186"], ["Milan", "20121"], ["Turin", "10121"], ["Florence", "50122"], ["Naples", "80132"], ["Bologne", "40121"]],
    streets: ["via del Corso", "via Montenapoleone", "via Roma", "via dei Calzaiuoli", "via Toledo", "via dell'Indipendenza"]
  },
  "Royaume-Uni": {
    poids: 7,
    indicatif: "+44 7",
    cities: [["Londres", "SW1A 1AA"], ["Londres", "EC1A 1BB"], ["Manchester", "M1 1AE"], ["Édimbourg", "EH1 1YZ"], ["Liverpool", "L1 8JQ"], ["Bristol", "BS1 4DJ"]],
    streets: ["Oxford Street", "Baker Street", "Regent Street", "Princes Street", "Market Street", "Park Street"]
  },
  "États-Unis": {
    poids: 7,
    indicatif: "+1 212",
    cities: [["New York", "NY 10001"], ["Los Angeles", "CA 90012"], ["Chicago", "IL 60601"], ["Miami", "FL 33130"], ["San Francisco", "CA 94103"], ["Boston", "MA 02108"]],
    streets: ["Fifth Avenue", "Broadway", "Sunset Boulevard", "Michigan Avenue", "Ocean Drive", "Market Street"]
  },
  "Allemagne": {
    poids: 6,
    indicatif: "+49 15",
    cities: [["Berlin", "10117"], ["Munich", "80331"], ["Hambourg", "20095"], ["Francfort", "60311"], ["Cologne", "50667"], ["Stuttgart", "70173"]],
    streets: ["Friedrichstraße", "Kaufingerstraße", "Mönckebergstraße", "Zeil", "Schildergasse", "Königstraße"]
  },
  "Portugal": {
    poids: 4,
    indicatif: "+351 9",
    cities: [["Lisbonne", "1100-148"], ["Porto", "4000-322"], ["Braga", "4700-321"], ["Coimbra", "3000-150"], ["Faro", "8000-138"]],
    streets: ["rua Augusta", "rua de Santa Catarina", "avenida da Liberdade", "rua do Souto", "rua Ferreira Borges"]
  }
};

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// Insère beaucoup de lignes en plusieurs requêtes (lots de 500) et renvoie les lignes insérées
async function insertEnLots(table, rows, taille = 500) {
  const inserted = [];
  for (let i = 0; i < rows.length; i += taille) {
    const { data, error } = await supabase.from(table).insert(rows.slice(i, i + taille)).select();
    if (error) throw new Error(`${table}: ${error.message}`);
    inserted.push(...data);
  }
  return inserted;
}

// Tirage pondéré d'un pays
function randomCountry() {
  const entries = Object.entries(countriesData);
  const total = entries.reduce((s, [, c]) => s + c.poids, 0);
  let r = Math.random() * total;
  for (const [nom, c] of entries) {
    r -= c.poids;
    if (r < 0) return nom;
  }
  return "France";
}

// Génère une adresse complète cohérente avec le pays
function randomAddress(pays) {
  const c = countriesData[pays];
  const [city, cp] = pick(c.cities);
  const street = `${Math.floor(1 + Math.random() * 150)} ${pick(c.streets)}`;
  return { street, city, cp, ligne: `${street}, ${cp} ${city}` };
}

// Génère un numéro de téléphone avec l'indicatif du pays
function randomPhone(pays) {
  return `${countriesData[pays].indicatif}${Math.floor(1000000 + Math.random() * 9000000)}`;
}

const brandsData = [
  ["Nike", "Équipementier sportif mondial et streetwear."],
  ["Adidas", "Marque aux trois bandes, sport et lifestyle."],
  ["Puma", "Marque sportive allemande innovante."],
  ["Apple", "Technologies haut de gamme, smartphones et ordinateurs."],
  ["Samsung", "Leader mondial de l'électronique grand public."],
  ["Sony", "Audio, vidéo et consoles PlayStation."],
  ["Zara", "Prêt-à-porter tendance et mode rapide."],
  ["H&M", "Mode accessible et collections éco-responsables."],
  ["Levi's", "Pionnier américain du denim et des jeans."],
  ["Lacoste", "Élégance sportive française au crocodile."],
  ["Asus", "Ordinateurs portables, composants et gaming."],
  ["Lenovo", "PC professionnels ThinkPad et tablettes."],
  ["Bose", "Casques et enceintes à réduction de bruit."],
  ["JBL", "Enceintes portables et casques audio festifs."],
  ["Under Armour", "Vêtements de performance et entraînement."],
  ["Uniqlo", "Basiques japonais de haute qualité et confort."],
  ["The North Face", "Vêtements outdoor, vestes techniques et sacs."],
  ["Patagonia", "Vêtements d'aventure et engagement écologique."],
  ["Calvin Klein", "Sous-vêtements, parfums et mode urbaine."],
  ["Tommy Hilfiger", "Style classique américain décontracté."],
  ["Vans", "Chaussures de skate et culture urbaine."],
  ["Converse", "Baskets iconiques Chuck Taylor All Star."],
  ["New Balance", "Sneakers rétro et running de haute précision."],
  ["Ray-Ban", "Lunettes de soleil emblématiques."],
  ["Fossil", "Montres, maroquinerie et accessoires intemporels."],
  ["Dyson", "Aspirateurs sans fil et technologies de pointe."],
  ["Nespresso", "Machines à café et capsules de grands crus."],
  ["Logitech", "Périphériques informatiques, souris et claviers."],
  ["Xiaomi", "Smartphones, trottinettes et objets connectés."],
  ["Marshall", "Amplis et enceintes au son rock légendaire."],
  ["Carhartt", "Workwear robuste et streetwear authentique."],
  ["Champion", "Sweats, hoodies et sportswear rétro."],
  ["Diesel", "Mode italienne audacieuse et denim haut de gamme."],
  ["Superdry", "Fusion de graphismes vintage américains et japonais."],
  ["Seiko", "Horlogerie japonaise de précision."],
  ["Casio", "Montres G-Shock et calculatrices légendaires."],
  ["GoPro", "Caméras d'action étanches pour l'aventure."],
  ["Garmin", "Montres GPS connectées pour le sport et l'outdoor."],
  ["KitchenAid", "Robots pâtissiers et petit électroménager."],
  ["Tefal", "Poêles antiadhésives et ustensiles culinaires."],
  ["Philips", "Éclairage connecté Hue et rasoirs électriques."],
  ["Braun", "Rasoirs de précision et soin personnel."],
  ["Eastpak", "Sacs à dos garantis 30 ans pour le quotidien."],
  ["Herschel", "Sacs de voyage et accessoires d'inspiration vintage."],
  ["Oakley", "Lunettes de sport haute performance."],
  ["Timberland", "Bottes jaunes emblématiques et style outdoor."],
  ["Dr. Martens", "Chaussures et bottines en cuir à semelle coussin d'air."],
  ["Birkenstock", "Sandales orthopédiques allemandes tendance."],
  ["Salomon", "Trail, running et équipements de montagne."],
  ["Columbia", "Vestes imperméables et équipements grand froid."]
];

const categoriesData = [
  ["Mode & Vêtements", "Tous les vêtements pour homme, femme et enfant.", null],
  ["Homme", "Rayon vêtements et accessoires pour homme.", "Mode & Vêtements"],
  ["Femme", "Rayon vêtements et accessoires pour femme.", "Mode & Vêtements"],
  ["Enfant", "Vêtements et chaussures pour enfants.", "Mode & Vêtements"],
  ["Chaussures", "Baskets, bottes, sandales et souliers.", null],
  ["Sneakers", "Baskets urbaines et de collection.", "Chaussures"],
  ["Bottes & Bottines", "Chaussures montantes pour l'hiver.", "Chaussures"],
  ["Sandales", "Chaussures ouvertes d'été.", "Chaussures"],
  ["High-Tech & Électronique", "Smartphones, ordinateurs et gadgets.", null],
  ["Smartphones", "Téléphones portables iOS et Android.", "High-Tech & Électronique"],
  ["Ordinateurs Portables", "PC portables et MacBook.", "High-Tech & Électronique"],
  ["Audio & Casques", "Écouteurs sans fil, casques et enceintes.", "High-Tech & Électronique"],
  ["Montres & Objets Connectés", "Smartwatches et bracelets de sport.", "High-Tech & Électronique"],
  ["Gaming & Consoles", "Jeux vidéo, manettes et accessoires.", "High-Tech & Électronique"],
  ["Sport & Fitness", "Équipements et tenues d'entraînement.", null],
  ["Running", "Chaussures et tenues de course à pied.", "Sport & Fitness"],
  ["Musculation & Crossfit", "Accessoires et vêtements de fitness.", "Sport & Fitness"],
  ["Outdoor & Randonnée", "Sacs à dos, tentes et vestes de rando.", "Sport & Fitness"],
  ["Maison & Décoration", "Mobilier, literie et objets déco.", null],
  ["Cuisine & Art de la table", "Ustensiles, casseroles et robots.", "Maison & Décoration"],
  ["Électroménager", "Aspirateurs, machines à café, fers.", "Maison & Décoration"],
  ["Bagagerie & Maroquinerie", "Sacs à dos, valises et portefeuilles.", null],
  ["Accessoires de Mode", "Lunettes, casquettes, bonnets et ceintures.", null],
  ["Pantalons & Jeans", "Jeans slim, regular, cargos et chinos.", "Mode & Vêtements"],
  ["T-shirts & Polos", "Hauts à manches courtes basiques et imprimés.", "Mode & Vêtements"],
  ["Sweats & Sweats à capuche", "Hoodies et pulls molletonnés.", "Mode & Vêtements"],
  ["Vestes & Manteaux", "Parkas, doudounes, blousons et coupe-vents.", "Mode & Vêtements"],
  ["Sous-vêtements", "Boxers, caleçons et chaussettes.", "Mode & Vêtements"],
  ["Tablettes Tactiles", "iPad et tablettes Android pour la productivité.", "High-Tech & Électronique"],
  ["Appareils Photo & Drones", "Caméras 4K et prises de vue aériennes.", "High-Tech & Électronique"],
  ["Lunettes de Soleil", "Protection UV et montures stylées.", "Accessoires de Mode"],
  ["Montres Classiques", "Horlogerie mécanique et à quartz.", "Accessoires de Mode"],
  ["Nutrition Sportive", "Protéines, barres énergétiques et vitamines.", "Sport & Fitness"],
  ["Camping & Bivouac", "Duvets, réchauds et matériel de survie.", "Outdoor & Randonnée"],
  ["Robots de Cuisine", "Mélangeurs, blenders et cuiseurs.", "Cuisine & Art de la table"],
  ["Café & Thé", "Machines espresso, moulins et thés bio.", "Cuisine & Art de la table"],
  ["Entretien du Sol", "Aspirateurs balais et robots laveurs.", "Électroménager"],
  ["Pulls & Gilets", "Tricots en laine, mérinos et cachemire.", "Mode & Vêtements"],
  ["Shorts & Bermudas", "Vêtements légers pour la saison estivale.", "Mode & Vêtements"],
  ["Robes & Jupes", "Tenues féminines pour toutes les occasions.", "Mode & Vêtements"],
  ["Costumes & Blazers", "Tenues habillées pour cérémonies et travail.", "Mode & Vêtements"],
  ["Valises Cabine", "Bagages aux normes des compagnies aériennes.", "Bagagerie & Maroquinerie"],
  ["Sacs Banane & Pochettes", "Maroquinerie compacte et pratique.", "Bagagerie & Maroquinerie"],
  ["Chapeaux & Bonnets", "Couvre-chefs d'hiver et chapeaux d'été.", "Accessoires de Mode"],
  ["Ceintures en Cuir", "Accessoires indispensables pour pantalons.", "Accessoires de Mode"],
  ["Périphériques PC", "Souris ergonomiques, claviers mécaniques.", "High-Tech & Électronique"],
  ["Écrans PC & Moniteurs", "Dalles IPS 144Hz et écrans 4K bureautique.", "High-Tech & Électronique"],
  ["Stockage & Disques Durs", "SSD NVMe externes et clés USB rapides.", "High-Tech & Électronique"],
  ["Randonnée Hivernale", "Raquettes, crampons et vêtements thermiques.", "Outdoor & Randonnée"],
  ["Cyclisme & VTT", "Casques de vélo, maillots et bidons.", "Sport & Fitness"]
];

const productsData = [
  ["Air Max 90", "Chaussure de running légendaire au confort aérien.", 1],
  ["Air Force 1 '07", "L'icône du basketball réinventée pour le quotidien.", 1],
  ["Ultraboost Light", "Amorti dynamique et retour d'énergie exceptionnel.", 2],
  ["Stan Smith Classic", "La sneaker blanche épurée et indémodable.", 2],
  ["Suede Classic XXI", "Chaussure basse en suède doux emblématique.", 3],
  ["iPhone 16 Pro", "Boîtier en titane avec puce A18 Pro ultra-rapide.", 4],
  ["MacBook Air M3", "Finesse remarquable, autonomie de 18 heures.", 4],
  ["AirPods Pro 2", "Réduction active du bruit de niveau supérieur.", 4],
  ["Galaxy S24 Ultra", "Appareil photo 200 Mpx et stylet S Pen intégré.", 5],
  ["Galaxy Watch 6", "Suivi santé avancé et analyse du sommeil.", 5],
  ["PlayStation 5 Slim", "Graphismes 4K jusqu'à 120 FPS avec audio 3D.", 6],
  ["WH-1000XM5", "Casque audio circum-aural sans fil haute fidélité.", 6],
  ["Jean 501 Original", "Le jean coupe droite classique à braguette boutonnée.", 9],
  ["Veste Trucker Denim", "Veste en jean robuste et intemporelle.", 9],
  ["Polo Classique L.12.12", "Petit piqué de coton fin avec crocodile brodé.", 10],
  ["Casquette Sport", "Casquette en gabardine respirante réglable.", 10],
  ["ZenBook 14 OLED", "Écran OLED lumineux pour les créateurs nomades.", 11],
  ["ThinkPad X1 Carbon", "Le PC portable d'entreprise le plus léger et robuste.", 12],
  ["QuietComfort 45", "Casque Bluetooth légendaire à réduction de bruit.", 13],
  ["Flip 6 Portable", "Enceinte étanche au son puissant et immersif.", 14],
  ["T-shirt Tech 2.0", "Matière ultra-légère évacuant la transpiration.", 15],
  ["Doudoune Ultra Légère", "Chaleur compactable dans son petit pochon de voyage.", 16],
  ["Veste Nuptse 1996", "Doudoune rétro en duvet d'oie 700 garnissage chaud.", 17],
  ["Parka Torrentshell 3L", "Imperméable respirant 3 couches écologique.", 18],
  ["Pack 3 Boxers Coton", "Ceinture élastique logotée en coton stretch doux.", 19],
  ["Sweatshirt Flag Icon", "Molleton de coton doux avec drapeau brodé.", 20],
  ["Old Skool Classic", "Basket de skate avec la rayure sidestripe emblématique.", 21],
  ["Chuck 70 Vintage", "Toile renforcée et semelle amortissante classique.", 22],
  ["Sneakers 574 Core", "Modèle hybride route/trail au style intemporel.", 23],
  ["Lunettes Aviator Classic", "Monture dorée en métal et verres minéraux G-15.", 24],
  ["Montre Chronographe Nate", "Boîtier en acier inoxydable noir 50 mm résistant.", 25],
  ["Aspirateur V15 Detect", "Laser révélant la poussière microscopique.", 26],
  ["Machine Vertuo Pop", "Café barista en capsules aux arômes intenses.", 27],
  ["Souris MX Master 3S", "Défilement MagSpeed ultra-rapide et clic silencieux.", 28],
  ["Redmi Note 13 Pro", "Écran AMOLED 120Hz et charge turbo 67W.", 29],
  ["Enceinte Stanmore III", "Son stéréo immersif avec design vintage rock.", 30],
  ["Veste Duck Detroit", "Toile de coton épaisse doublée pour le gros œuvre.", 31],
  ["Sweat Reverse Weave", "Coupe droite anti-rétrécissement classique.", 32],
  ["Jean D-Strukt Slim", "Denim stretch à délavage artisanal moderne.", 33],
  ["Veste Windcheater", "Coupe-vent triple zip avec doublure polaire.", 34],
  ["Montre Automatique 5 Sports", "Mouvement automatique visible à fond transparent.", 35],
  ["Montre G-Shock GA-2100", "Boîtier ultra-résistant renforcé de carbone.", 36],
  ["Caméra HERO12 Black", "Vidéo 5.3K HDR avec stabilisation HyperSmooth 6.0.", 37],
  ["Montre Forerunner 265", "Écran AMOLED tactile et métriques de course précises.", 38],
  ["Robot Pâtissier Artisan", "Mouvement planétaire robuste en métal coulé.", 39],
  ["Poêle Ingenio 28cm", "Poignée amovible et revêtement antiadhésif titane.", 40],
  ["Kit de démarrage Hue", "Ampoules LED connectées blanches et couleurs.", 41],
  ["Rasoir Series 9 Pro+", "Tête de rasage flexible avec 40 000 coupes/minute.", 42],
  ["Sac à dos Padded Pak'r", "Le sac scolaire et urbain indestructible 24L.", 43],
  ["Bottes 6-inch Premium", "Cuir imperméable nubuck jaune mythique.", 46]
];

async function runSeed() {
  console.log("🚀 Début du peuplement automatique de Supabase...");

  // 1. Nettoyage initial des tables
  console.log("🧹 Nettoyage des données existantes...");
  const tablesToClean = [
    'commandes', 'code_promotions', 'promotions', 'panier_item', 'panier',
    'variantes_prix', 'variantes', 'produit_categories', 'produits',
    'categories', 'marques', 'adresses', 'users'
  ];
  for (const t of tablesToClean) {
    const { error } = await supabase.from(t).delete().neq('id', 0);
    if (error) console.warn(`Note sur nettoyage ${t}:`, error.message);
  }

  // 2. Users (NB_USERS = 55)
  if (firstNames.length < NB_USERS || lastNames.length < NB_USERS) throw new Error("Pas assez de noms pour NB_USERS");
  console.log(`👥 Insertion de ${NB_USERS} utilisateurs...`);
  // Pays de résidence de chaque utilisateur (utilisé pour le téléphone, l'adresse et les commandes)
  const userCountries = Array.from({ length: NB_USERS }, () => randomCountry());
  const users = [];
  for (let i = 1; i <= NB_USERS; i++) {
    const fn = firstNames[i - 1];
    const ln = lastNames[i - 1];
    const email = `${fn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}.${ln.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}${i}@example.com`;
    const rStatus = Math.random();
    const status = rStatus < 0.8 ? 'A' : (rStatus < 0.9 ? 'I' : 'C');
    users.push({
      email,
      name: `${fn} ${ln}`,
      password_hash: "$2b$12$e80yV8pY6E...mock_hashed_password",
      token: Math.random() > 0.3 ? `tok_${Math.floor(100000 + Math.random() * 900000)}` : null,
      phone_number: Math.random() > 0.15 ? randomPhone(userCountries[i - 1]) : null,
      age: Math.floor(18 + Math.random() * 55),
      status,
      creation_date: new Date(Date.now() - Math.floor(Math.random() * 700 * 86400000)).toISOString()
    });
  }
  const { data: insertedUsers, error: uErr } = await supabase.from('users').insert(users).select();
  if (uErr) throw new Error("Users: " + uErr.message);
  console.log(`✅ ${insertedUsers.length} utilisateurs insérés.`);

  // ---------------------------------------------------------------------------
  // Profils d'achat des clients (dates de commandes maîtrisées)
  //  - Délai de réachat : nombre de jours entre le 1er achat et la 2e commande validée.
  //    ~40 % des clients recommandent sous 30 j, ~25 % entre 31 et 60 j, ~15 % entre 61 et 90 j,
  //    ~10 % entre 91 et 150 j, ~10 % ne recommandent jamais (une seule commande).
  //    => cumulé : ~40 % à 30 j, ~65 % à 60 j, ~80 % à 90 j.
  //  - Clients « dormants » : ils ont acheté puis plus rien depuis au moins 180 jours
  //    (toutes leurs commandes datent de plus de 180 jours).
  //  - Tous les clients ont leur 1er achat il y a au moins 95 jours (les 90 jours sont observables).
  // ---------------------------------------------------------------------------
  const melanger = arr => [...arr].sort(() => Math.random() - 0.5);
  const randInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
  const joursEnDate = j => new Date(Date.now() - Math.floor(j * 86400000)).toISOString();

  const NB_CLIENTS_DORMANTS = 8;
  const dormantIds = new Set(melanger(insertedUsers).slice(0, NB_CLIENTS_DORMANTS).map(u => u.id));

  const tranchesReachat = [
    { part: 0.40, min: 1, max: 30 },
    { part: 0.25, min: 31, max: 60 },
    { part: 0.15, min: 61, max: 90 },
    { part: 0.10, min: 91, max: 150 }
  ]; // le reste (~10 %) ne recommande jamais
  const profils = {}; // user_id -> { delai, dormant, minAgo, joursPremier }
  const ordreClients = melanger(insertedUsers);
  let pos = 0;
  for (const t of tranchesReachat) {
    const nb = Math.round(NB_USERS * t.part);
    for (let k = 0; k < nb && pos < ordreClients.length; k++, pos++) {
      profils[ordreClients[pos].id] = { delai: randInt(t.min, t.max) };
    }
  }
  for (; pos < ordreClients.length; pos++) profils[ordreClients[pos].id] = { delai: null };
  for (const u of insertedUsers) {
    const p = profils[u.id];
    const d = p.delai ?? 0;
    p.dormant = dormantIds.has(u.id);
    p.minAgo = p.dormant ? 181 : 0; // une commande d'un dormant ne peut pas être plus récente que 181 jours
    p.joursPremier = p.dormant
      ? d + 190 + randInt(0, 200)               // dormant : 1er achat très ancien
      : Math.max(d + 10, 95) + randInt(0, 230); // actif : 1er achat il y a 95 à ~330 jours
  }
  // Date d'une commande « ordinaire » : après la 2e commande, jusqu'à aujourd'hui (ou 181 j pour un dormant)
  const dateAutreCommande = userId => {
    const p = profils[userId];
    const haut = p.joursPremier - p.delai;
    return joursEnDate(p.minAgo + Math.random() * (haut - p.minAgo));
  };
  const clientsQuiRecommandent = insertedUsers.filter(u => profils[u.id].delai !== null);

  // 3. Adresses (1 par utilisateur)
  console.log(`📍 Insertion de ${NB_USERS} adresses...`);
  const adresses = [];
  const userAddressById = {}; // user_id -> { domicile, ville, pays, phone }
  insertedUsers.forEach((u, idx) => {
    const pays = userCountries[idx];
    const { ligne, cp, city } = randomAddress(pays);
    const defChoices = ['D', 'D', 'D', 'T', 'A'];
    adresses.push({
      user_id: u.id,
      domicile: ligne,
      travail: Math.random() > 0.5 ? `Zone d'Activité Pro, ${cp} ${city}` : null,
      autre: Math.random() > 0.7 ? `Résidence Secondaire, 06000 Nice` : null,
      pays,
      defaut: pick(defChoices)
    });
    userAddressById[u.id] = { domicile: ligne, ville: city, pays, phone: u.phone_number };
  });
  const { data: insertedAddr, error: aErr } = await supabase.from('adresses').insert(adresses).select();
  if (aErr) throw new Error("Adresses: " + aErr.message);
  console.log(`✅ ${insertedAddr.length} adresses insérées.`);

  // 4. Marques (50)
  console.log("🏷️ Insertion de 50 marques...");
  const marques = brandsData.map(([name, description]) => ({ name, description }));
  const { data: insertedMarques, error: mErr } = await supabase.from('marques').insert(marques).select();
  if (mErr) throw new Error("Marques: " + mErr.message);
  console.log(`✅ ${insertedMarques.length} marques insérées.`);

  // 5. Catégories (50)
  console.log("📂 Insertion de 50 catégories...");
  const categories = categoriesData.map(([nom, description, sous_categories]) => ({
    nom, description, sous_categories
  }));
  const { data: insertedCats, error: cErr } = await supabase.from('categories').insert(categories).select();
  if (cErr) throw new Error("Categories: " + cErr.message);
  console.log(`✅ ${insertedCats.length} catégories insérées.`);

  // 6. Produits (50)
  console.log("📦 Insertion de 50 produits...");
  const produits = productsData.map(([nom, description, mIdx], i) => {
    const marqueId = insertedMarques[mIdx - 1]?.id || insertedMarques[0].id;
    return {
      nom,
      description,
      reference_commerciale: `REF-${1000 + i + 1}`,
      marque_id: marqueId,
      creation_date: new Date(Date.now() - Math.floor(Math.random() * 400 * 86400000)).toISOString()
    };
  });
  const { data: insertedProds, error: pErr } = await supabase.from('produits').insert(produits).select();
  if (pErr) throw new Error("Produits: " + pErr.message);
  console.log(`✅ ${insertedProds.length} produits insérés.`);

  // 7. Produit_Categories (~75)
  console.log("🔗 Liaison Produits <-> Catégories (N:N)...");
  const pcLinks = [];
  const pcSet = new Set();
  for (const p of insertedProds) {
    const cat1 = insertedCats[Math.floor(Math.random() * insertedCats.length)].id;
    pcLinks.push({ produit_id: p.id, categorie_id: cat1 });
    pcSet.add(`${p.id}_${cat1}`);

    if (Math.random() > 0.5) {
      const cat2 = insertedCats[Math.floor(Math.random() * insertedCats.length)].id;
      if (!pcSet.has(`${p.id}_${cat2}`)) {
        pcLinks.push({ produit_id: p.id, categorie_id: cat2 });
        pcSet.add(`${p.id}_${cat2}`);
      }
    }
  }
  const { error: pcErr } = await supabase.from('produit_categories').insert(pcLinks);
  if (pcErr) throw new Error("Produit_categories: " + pcErr.message);
  console.log(`✅ ${pcLinks.length} liaisons produit-catégorie insérées.`);

  // 8. Variantes (75)
  console.log("👕 Insertion de 75 variantes de produits...");
  const tailles = ["XS", "S", "M", "L", "XL", "38", "40", "42", "44", "128Go", "256Go", "512Go", "Unique"];
  const couleurs = ["Noir", "Blanc", "Gris", "Bleu Marine", "Rouge", "Vert", "Titane", "Or", "Argent"];
  const variantes = [];
  let skuCounter = 1;
  for (const p of insertedProds) {
    const nbVar = p.id % 2 === 0 ? 2 : 1;
    for (let v = 0; v < nbVar; v++) {
      const t = tailles[Math.floor(Math.random() * tailles.length)];
      const c = couleurs[Math.floor(Math.random() * couleurs.length)];
      const rStk = Math.random();
      const stock = rStk < 0.15 ? 0 : (rStk < 0.35 ? Math.floor(1 + Math.random() * 3) : Math.floor(10 + Math.random() * 120));
      variantes.push({
        product_id: p.id,
        taille: t,
        couleur: c,
        sku: `SKU-${skuCounter++}-${t.slice(0, 3).toUpperCase()}-${c.slice(0, 3).toUpperCase()}`,
        stock
      });
    }
  }
  // Variantes volontairement jamais achetées (pour le défi « variantes jamais achetées ») :
  // elles ne seront mises dans aucun panier. 10 variantes, dont 2 en rupture de stock.
  const NB_VARIANTES_JAMAIS_ACHETEES = 10;
  const idxMelanges = variantes.map((_, i) => i).sort(() => Math.random() - 0.5);
  const skusJamaisAchetes = new Set();
  idxMelanges.slice(0, NB_VARIANTES_JAMAIS_ACHETEES).forEach((idx, k) => {
    variantes[idx].stock = k < 2 ? 0 : Math.floor(5 + Math.random() * 100);
    skusJamaisAchetes.add(variantes[idx].sku);
  });

  const { data: insertedVars, error: vErr } = await supabase.from('variantes').insert(variantes).select();
  if (vErr) throw new Error("Variantes: " + vErr.message);
  console.log(`✅ ${insertedVars.length} variantes insérées.`);
  // Variantes pouvant être mises dans un panier (toutes sauf celles jamais achetées)
  const variantesAchetables = insertedVars.filter(v => !skusJamaisAchetes.has(v.sku));
  console.log(`🚫 ${skusJamaisAchetes.size} variantes ne seront jamais achetées.`);

  // 9. Variantes_Prix
  console.log("💶 Insertion des prix des variantes...");
  const prix = insertedVars.map(v => {
    const isPast = Math.random() < 0.2;
    return {
      variante_id: v.id,
      price: +(15 + Math.random() * 800).toFixed(2),
      device: Math.random() > 0.1 ? 'EUR' : 'USD',
      date_debut: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0],
      date_fin: isPast ? new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0] : null
    };
  });
  const { error: prErr } = await supabase.from('variantes_prix').insert(prix);
  if (prErr) throw new Error("Prix: " + prErr.message);
  console.log(`✅ ${prix.length} prix de variantes insérés.`);

  // Préparation des commandes supplémentaires : 20 villes avec au moins 30 commandes validées chacune
  // (toutes les villes distinctes de tous les pays, mélangées, puis on en garde 20)
  const NB_VILLES = 20;
  const MIN_COMMANDES_PAR_VILLE = 30;
  const etatsValides = ["payee", "expediee", "livree"];
  const etatsNonValides = ["en_attente", "annulee"];
  const toutesVilles = [];
  const villesVues = new Set();
  for (const [pays, c] of Object.entries(countriesData)) {
    for (const [city, cp] of c.cities) {
      if (!villesVues.has(city)) {
        villesVues.add(city);
        toutesVilles.push({ pays, city, cp });
      }
    }
  }
  for (let i = toutesVilles.length - 1; i > 0; i--) { // mélange (Fisher-Yates)
    const j = Math.floor(Math.random() * (i + 1));
    [toutesVilles[i], toutesVilles[j]] = [toutesVilles[j], toutesVilles[i]];
  }
  const commandesSupp = [];
  for (const ville of toutesVilles.slice(0, NB_VILLES)) {
    // 30 commandes validées garanties + 0 à 8 commandes en attente / annulées
    const nbNonValides = Math.floor(Math.random() * 9);
    for (let k = 0; k < MIN_COMMANDES_PAR_VILLE + nbNonValides; k++) {
      commandesSupp.push({
        ...ville,
        etat: k < MIN_COMMANDES_PAR_VILLE ? pick(etatsValides) : pick(etatsNonValides),
        user: Math.random() > 0.3 ? pick(clientsQuiRecommandent) : null // 70 % clients inscrits, 30 % invités
      });
    }
  }
  // Chaque client qui recommande reçoit sa 2e commande validée, exactement `delai` jours après son 1er achat
  const candidates2e = melanger(commandesSupp.filter(cs => etatsValides.includes(cs.etat) && cs.user));
  clientsQuiRecommandent.forEach((u, idx) => {
    const cs = candidates2e[idx];
    cs.user = u;
    cs.dateFixe = joursEnDate(profils[u.id].joursPremier - profils[u.id].delai);
  });

  // 10. Panier (1 par client + 1 par commande supplémentaire)
  const paniers = [];
  for (let i = 0; i < NB_USERS; i++) {
    paniers.push({
      user_id: insertedUsers[i].id, // chaque client a un panier, donc une commande
      session_token: null,
      variant_sku: `SKU-P${i + 1}`,
      quantite: Math.floor(1 + Math.random() * 4),
      creation_date: new Date(Date.now() - Math.floor(Math.random() * 45 * 86400000)).toISOString()
    });
  }
  for (const cs of commandesSupp) {
    paniers.push({
      user_id: cs.user ? cs.user.id : null,
      session_token: cs.user ? null : `sess_${Math.floor(10000000 + Math.random() * 90000000)}`,
      variant_sku: `SKU-P${paniers.length + 1}`,
      quantite: Math.floor(1 + Math.random() * 4),
      creation_date: new Date(Date.now() - Math.floor(Math.random() * 45 * 86400000)).toISOString()
    });
  }
  console.log(`🛒 Insertion de ${paniers.length} paniers...`);
  const insertedPaniers = await insertEnLots('panier', paniers);
  console.log(`✅ ${insertedPaniers.length} paniers insérés.`);

  // 11. Panier_Item
  // Certaines paires de variantes sont achetées ensemble très souvent (pour le défi « paires les plus fréquentes »).
  console.log("🛍️ Insertion d'articles dans les paniers...");
  const probasPaires = [0.14, 0.10, 0.08, 0.06, 0.04, 0.03]; // part des paniers contenant chaque paire
  const variantesPourPaires = melanger(variantesAchetables);
  const pairesAffines = probasPaires.map((proba, i) => ({
    a: variantesPourPaires[2 * i],
    b: variantesPourPaires[2 * i + 1],
    proba,
    nb: 0
  }));
  const panierItems = [];
  const piSet = new Set();
  const ajouterItem = (panierId, varianteId, qteMax) => {
    if (piSet.has(`${panierId}_${varianteId}`)) return;
    piSet.add(`${panierId}_${varianteId}`);
    panierItems.push({ panier_id: panierId, variante_id: varianteId, quantite: Math.floor(1 + Math.random() * qteMax) });
  };
  for (const pan of insertedPaniers) {
    // Ce panier contient-il l'une des paires fréquentes ?
    let r = Math.random();
    const paire = pairesAffines.find(pa => (r -= pa.proba) < 0);
    if (paire) {
      paire.nb++;
      ajouterItem(pan.id, paire.a.id, 3);
      ajouterItem(pan.id, paire.b.id, 3);
      if (Math.random() < 0.3) ajouterItem(pan.id, pick(variantesAchetables).id, 2); // un 3e article au hasard
    } else {
      ajouterItem(pan.id, pick(variantesAchetables).id, 4);
      if (Math.random() > 0.5) ajouterItem(pan.id, pick(variantesAchetables).id, 2);
    }
  }
  console.log("🤝 Paires de variantes volontairement fréquentes (nombre de paniers) :");
  console.table(pairesAffines.map(pa => ({ variante_a: pa.a.sku, variante_b: pa.b.sku, paniers: pa.nb })));
  await insertEnLots('panier_item', panierItems);
  console.log(`✅ ${panierItems.length} articles de paniers insérés.`);

  // 12. Promotions (50)
  console.log("🎁 Insertion de 50 promotions...");
  const promoTypes = ['produit', 'categorie', 'commande'];
  const promos = [];
  for (let i = 1; i <= 50; i++) {
    const t = promoTypes[Math.floor(Math.random() * promoTypes.length)];
    const pTarget = t === 'produit' ? insertedProds[Math.floor(Math.random() * insertedProds.length)].id : null;
    const cTarget = t === 'categorie' ? insertedCats[Math.floor(Math.random() * insertedCats.length)].id : null;
    const rDt = Math.random();
    let sDt, eDt;
    if (rDt < 0.2) {
      sDt = new Date(Date.now() - 60 * 86400000);
      eDt = new Date(Date.now() - 5 * 86400000);
    } else if (rDt < 0.3) {
      sDt = new Date(Date.now() + 10 * 86400000);
      eDt = new Date(Date.now() + 40 * 86400000);
    } else {
      sDt = new Date(Date.now() - 10 * 86400000);
      eDt = new Date(Date.now() + 30 * 86400000);
    }

    promos.push({
      nom: `Offre Spéciale #${i}`,
      pourcentage: [5, 10, 15, 20, 30, 40, 50][Math.floor(Math.random() * 7)],
      type: t,
      produit_id: pTarget,
      categorie_id: cTarget,
      start_date: sDt.toISOString(),
      end_date: eDt.toISOString()
    });
  }
  const { data: insertedPromos, error: proErr } = await supabase.from('promotions').insert(promos).select();
  if (proErr) throw new Error("Promotions: " + proErr.message);
  console.log(`✅ ${insertedPromos.length} promotions insérées.`);

  // 13. Code_Promotions (50)
  console.log("🎟️ Insertion de 50 codes promos...");
  const codes = [];
  for (let i = 0; i < 50; i++) {
    const base = ["WELCOME", "SUMMER", "VIP", "FLASH", "PRIVILEGE", "LUCKY", "BIGDATA", "PROMO"][i % 8];
    const isPersonal = Math.random() < 0.3;
    const userId = isPersonal ? insertedUsers[Math.floor(Math.random() * insertedUsers.length)].id : null;
    // Si réservé à un client : 1 seule utilisation possible
    // Si public : quota de personnes (ex: 10, 25, 50, 100, 500 personnes max)
    const quotaPersonnes = isPersonal ? 1 : [10, 25, 50, 100, 250, 500, 1000][Math.floor(Math.random() * 7)];

    codes.push({
      code: `${base}${i + 1}`,
      promotions_id: insertedPromos[i].id,
      nombre_usage: quotaPersonnes,
      user_id: userId
    });
  }
  const { error: codErr } = await supabase.from('code_promotions').insert(codes);
  if (codErr) throw new Error("Code promos: " + codErr.message);
  console.log(`✅ ${codes.length} codes promos insérés.`);

  // 14. Commandes : 1 par client (garantie) + commandes supplémentaires par ville
  console.log(`📦 Insertion de ${NB_USERS} commandes (une par client)...`);
  const etats = ["en_attente", "payee", "expediee", "livree", "annulee"];
  const commandes = [];
  const commandesParPays = {};
  for (let i = 0; i < NB_USERS; i++) {
    // Chaque client inscrit a au moins une commande, livrée à son adresse (donc dans son pays)
    const u = insertedUsers[i];

    let pays, ville, adrLigne, tel;
    if (u && userAddressById[u.id]) {
      ({ pays, ville, domicile: adrLigne } = userAddressById[u.id]);
      tel = userAddressById[u.id].phone || randomPhone(pays);
    } else {
      pays = randomCountry();
      const adr = randomAddress(pays);
      adrLigne = adr.ligne;
      ville = adr.city;
      tel = randomPhone(pays);
    }
    commandesParPays[pays] = (commandesParPays[pays] || 0) + 1;

    commandes.push({
      numero_commande: `CMD-2026-${1001 + i}`,
      panier_id: insertedPaniers[i]?.id || null,
      user_id: u ? u.id : null,
      etat: pick(etatsValides), // le 1er achat de chaque client est une commande validée
      email: u ? u.email : `invite${i + 1}@example.com`,
      adresse: `${adrLigne} - ${pays}`, // même format que test_live.html
      ville,
      pays,
      numero_tel: tel,
      creation_date: joursEnDate(profils[u.id].joursPremier) // 1er achat
    });
  }

  // Commandes supplémentaires : 20 villes, au moins 30 commandes validées par ville
  console.log(`📦 Ajout de ${commandesSupp.length} commandes réparties sur ${NB_VILLES} villes...`);
  const commandesParVille = {};
  commandesSupp.forEach((cs, j) => {
    const street = `${Math.floor(1 + Math.random() * 150)} ${pick(countriesData[cs.pays].streets)}`;
    commandesParPays[cs.pays] = (commandesParPays[cs.pays] || 0) + 1;
    const cleVille = `${cs.city} (${cs.pays})`;
    commandesParVille[cleVille] ??= { total: 0, validees: 0 };
    commandesParVille[cleVille].total++;
    if (etatsValides.includes(cs.etat)) commandesParVille[cleVille].validees++;

    commandes.push({
      numero_commande: `CMD-2026-${1001 + NB_USERS + j}`,
      panier_id: insertedPaniers[NB_USERS + j]?.id || null,
      user_id: cs.user ? cs.user.id : null,
      etat: cs.etat,
      email: cs.user ? cs.user.email : `invite${NB_USERS + 1 + j}@example.com`,
      adresse: `${street}, ${cs.cp} ${cs.city} - ${cs.pays}`,
      ville: cs.city,
      pays: cs.pays,
      numero_tel: randomPhone(cs.pays),
      creation_date: cs.dateFixe ?? (cs.user ? dateAutreCommande(cs.user.id) : joursEnDate(Math.random() * 120))
    });
  });

  await insertEnLots('commandes', commandes);
  const clientsAvecCommande = new Set(commandes.map(c => c.user_id).filter(Boolean)).size;
  console.log(`👥 ${clientsAvecCommande} clients sur ${insertedUsers.length} ont au moins une commande.`);
  const pctReachat = j => Math.round(100 * Object.values(profils).filter(p => p.delai !== null && p.delai <= j).length / NB_USERS);
  console.log(`🔁 Réachat après le 1er achat : ${pctReachat(30)} % sous 30 j, ${pctReachat(60)} % sous 60 j, ${pctReachat(90)} % sous 90 j.`);
  console.log(`😴 ${dormantIds.size} clients dormants (aucune commande depuis plus de 180 jours) : ${[...dormantIds].join(', ')}`);
  console.log(`✅ ${commandes.length} commandes insérées. Répartition par pays :`);
  console.table(commandesParPays);
  console.log("Répartition des commandes supplémentaires par ville :");
  console.table(commandesParVille);

  console.log("\n🎉 TOUTES LES DONNÉES ONT ÉTÉ INSÉRÉES DIRECTEMENT DANS SUPABASE AVEC SUCCÈS !");
}

runSeed().catch(err => {
  console.error("❌ Erreur pendant le seed :", err);
  process.exit(1);
});
