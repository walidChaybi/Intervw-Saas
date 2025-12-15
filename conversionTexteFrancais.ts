/**
 * Utilitaires de conversion de texte français vers valeurs numériques
 * Pour les dates écrites en toutes lettres (ex: "vingt-quatre octobre mil neuf cent quatre-vingt-cinq")
 */

const FRENCH_MONTHS: Record<string, string> = {
  janvier: "01",
  fevrier: "02",
  février: "02",
  mars: "03",
  avril: "04",
  mai: "05",
  juin: "06",
  juillet: "07",
  aout: "08",
  août: "08",
  septembre: "09",
  octobre: "10",
  novembre: "11",
  decembre: "12",
  décembre: "12"
};

const FRENCH_NUMBERS: Record<string, number> = {
  un: 1,
  premier: 1,
  une: 1,
  deux: 2,
  trois: 3,
  quatre: 4,
  cinq: 5,
  six: 6,
  sept: 7,
  huit: 8,
  neuf: 9,
  dix: 10,
  onze: 11,
  douze: 12,
  treize: 13,
  quatorze: 14,
  quinze: 15,
  seize: 16,
  "dix-sept": 17,
  "dix-huit": 18,
  "dix-neuf": 19,
  vingt: 20,
  trente: 30,
  quarante: 40,
  cinquante: 50,
  soixante: 60,
  cent: 100,
  cents: 100,
  mil: 1000,
  mille: 1000
};

type FieldType = "mois" | "jour" | "annee" | "nombre" | "texte";

/**
 * Convertit du texte français en valeur numérique
 * @param text - Le texte à convertir
 * @param fieldType - Le type de champ (mois, jour, annee, nombre, texte)
 * @returns La valeur convertie
 */
export const convertirTexteFrancais = (text: string, fieldType: FieldType): string => {
  const cleanText = text.toLowerCase().trim().replace(/-/g, " ").replace(/\s+/g, " ");

  // CAS : C'est un Mois
  if (fieldType === "mois") {
    for (const [key, val] of Object.entries(FRENCH_MONTHS)) {
      if (cleanText.includes(key)) return val;
    }
    // Si c'est déjà un chiffre ("10"), on le garde
    if (!isNaN(Number(cleanText)) && cleanText.length <= 2) {
      return cleanText.padStart(2, "0");
    }
  }

  // CAS : C'est un Nombre (Jour ou Année)
  // Si c'est déjà numérique ("1985"), on retourne direct
  if (/^\d+$/.test(text.trim())) {
    return text.trim();
  }

  // Sinon, on tente de parser le texte français
  const words = cleanText.split(" ");
  let total = 0;
  let currentAccumulator = 0;

  words.forEach(word => {
    const val = FRENCH_NUMBERS[word];
    if (val !== undefined) {
      if (val === 100 || val === 1000) {
        currentAccumulator = (currentAccumulator === 0 ? 1 : currentAccumulator) * val;
        total += currentAccumulator;
        currentAccumulator = 0;
      } else {
        // Cas "quatre-vingt" -> 80
        if (word === "vingt" && currentAccumulator === 4) {
          currentAccumulator = 80;
        } else {
          currentAccumulator += val;
        }
      }
    }
  });

  total += currentAccumulator;

  if (total > 0) {
    // Pour les jours, on ajoute un zéro devant si nécessaire
    if (fieldType === "jour" && total < 10) {
      return total.toString().padStart(2, "0");
    }
    return total.toString();
  }

  // Fallback : retourne le texte original nettoyé
  return text.trim();
};

/**
 * Détermine le type de champ à partir de son nom
 */
export const determinerTypeChamp = (nomChamp: string): FieldType => {
  const nom = nomChamp.toLowerCase();
  if (nom.includes("mois")) return "mois";
  if (nom.includes("jour")) return "jour";
  if (nom.includes("annee") || nom.includes("année")) return "annee";
  if (nom.includes("date")) return "nombre";
  return "texte";
};

/**
 * Nettoie le texte sélectionné
 */
export const nettoyerTexteSelectionne = (text: string): string => {
  return text
    .replace(/(\r\n|\n|\r)/gm, " ")
    .replace(/\s+/g, " ")
    .replace(/_{2,}/g, "")
    .trim();
};
