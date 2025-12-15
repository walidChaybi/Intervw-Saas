/**
 * Utilitaires pour l'assistance à la vérification des données d'actes
 * Compare les données du Resume avec le corpsTexte de l'acte
 */

export type EtatCorrespondance = "IDENTIQUE" | "DIFFERENT" | "INTROUVABLE";

export interface ISuggestionChamp {
  valeur: string;
  etat: EtatCorrespondance;
  score: number; // 0-100, plus élevé = meilleure correspondance
}

export interface ISuggestionsVerification {
  [cheminChamp: string]: ISuggestionChamp;
}

/**
 * Normalise un texte pour la comparaison (minuscules, suppression accents, ponctuation)
 */
const normaliserTexte = (texte: string): string => {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^\w\s]/g, " ") // Remplace ponctuation par espaces
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Calcule un score de similarité simple entre deux chaînes
 */
const calculerScoreSimilarite = (texte1: string, texte2: string): number => {
  const norm1 = normaliserTexte(texte1);
  const norm2 = normaliserTexte(texte2);

  if (norm1 === norm2) return 100;
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 80;

  // Calcul simple basé sur les mots communs
  const mots1 = norm1.split(/\s+/).filter(m => m.length > 2);
  const mots2 = norm2.split(/\s+/).filter(m => m.length > 2);
  const motsCommuns = mots1.filter(m => mots2.includes(m));
  if (motsCommuns.length === 0) return 0;

  return Math.min(70, (motsCommuns.length / Math.max(mots1.length, mots2.length)) * 100);
};

/**
 * Extrait une valeur depuis le corpsTexte en utilisant des patterns regex
 */
const extraireValeur = (corpsTexte: string, patterns: RegExp[]): string | null => {
  const texteNormalise = normaliserTexte(corpsTexte);

  for (const pattern of patterns) {
    const match = texteNormalise.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
};

/**
 * Compare une valeur du formulaire avec une valeur extraite du corpsTexte
 */
const comparerValeurs = (valeurFormulaire: string, valeurCorpsTexte: string | null): ISuggestionChamp => {
  if (!valeurCorpsTexte) {
    return { valeur: "", etat: "INTROUVABLE", score: 0 };
  }

  const score = calculerScoreSimilarite(valeurFormulaire, valeurCorpsTexte);
  const normForm = normaliserTexte(valeurFormulaire);
  const normCorps = normaliserTexte(valeurCorpsTexte);

  let etat: EtatCorrespondance;
  if (normForm === normCorps) {
    etat = "IDENTIQUE";
  } else if (score >= 50) {
    etat = "DIFFERENT";
  } else {
    etat = "INTROUVABLE";
  }

  return { valeur: valeurCorpsTexte, etat, score };
};

/**
 * Patterns regex pour extraire les informations selon la nature de l'acte
 */
const patternsExtraction = {
  NAISSANCE: {
    nomTitulaire: [
      /nom[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|naissance|sexe)/i,
      /enfant[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|naissance)/i
    ],
    prenomsTitulaire: [
      /prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|naissance|sexe)/i,
      /enfant[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|naissance)/i
    ],
    dateNaissance: [
      /ne[ée]?[:\s]+le[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
      /naissance[:\s]+le[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
      /date[:\s]+naissance[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i
    ],
    lieuNaissance: [
      /ne[ée]?[:\s]+(?:le[:\s]+\d+[\/\-\.]\d+[\/\-\.]\d+[:\s]+)?a[:\s]+([^,\.]+?)(?:,|\.|$)/i,
      /naissance[:\s]+(?:le[:\s]+\d+[\/\-\.]\d+[\/\-\.]\d+[:\s]+)?a[:\s]+([^,\.]+?)(?:,|\.|$)/i,
      /lieu[:\s]+naissance[:\s]+([^,\.]+?)(?:,|\.|$)/i
    ],
    nomParent1: [
      /pere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|mere|age)/i,
      /père[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|mere|age)/i
    ],
    prenomsParent1: [
      /pere[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|mere|age)/i,
      /père[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|mere|age)/i
    ],
    nomParent2: [
      /mere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|age|profession)/i,
      /mère[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|age|profession)/i
    ],
    prenomsParent2: [
      /mere[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|age|profession)/i,
      /mère[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|age|profession)/i
    ]
  },
  MARIAGE: {
    nomEpoux1: [
      /epoux[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|ne|age)/i,
      /epouse[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|ne|age)/i,
      /(?:premier|1er)[:\s]+epoux[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|ne|age)/i
    ],
    prenomsEpoux1: [
      /(?:premier|1er)[:\s]+epoux[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|ne|age)/i,
      /epoux[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|ne|age)/i
    ],
    nomEpoux2: [
      /(?:deuxieme|2e|second)[:\s]+epoux[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|ne|age)/i,
      /epouse[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|ne|age)/i
    ],
    prenomsEpoux2: [
      /(?:deuxieme|2e|second)[:\s]+epoux[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|ne|age)/i,
      /epouse[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|ne|age)/i
    ],
    dateMariage: [
      /marie[és]?[:\s]+le[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
      /mariage[:\s]+le[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
      /date[:\s]+mariage[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i
    ],
    lieuMariage: [
      /marie[és]?[:\s]+(?:le[:\s]+\d+[\/\-\.]\d+[\/\-\.]\d+[:\s]+)?a[:\s]+([^,\.]+?)(?:,|\.|$)/i,
      /mariage[:\s]+(?:le[:\s]+\d+[\/\-\.]\d+[\/\-\.]\d+[:\s]+)?a[:\s]+([^,\.]+?)(?:,|\.|$)/i,
      /lieu[:\s]+mariage[:\s]+([^,\.]+?)(?:,|\.|$)/i
    ],
    nomPereEpoux1: [
      /epoux[:\s]+[^:]+?pere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|mere|age)/i,
      /(?:premier|1er)[:\s]+epoux[:\s]+[^:]+?pere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|mere|age)/i
    ],
    prenomsPereEpoux1: [/epoux[:\s]+[^:]+?pere[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|mere|age)/i],
    nomMereEpoux1: [
      /epoux[:\s]+[^:]+?mere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|age|profession)/i,
      /(?:premier|1er)[:\s]+epoux[:\s]+[^:]+?mere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|age|profession)/i
    ],
    prenomsMereEpoux1: [/epoux[:\s]+[^:]+?mere[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|age|profession)/i],
    nomPereEpoux2: [
      /(?:deuxieme|2e|second)[:\s]+epoux[:\s]+[^:]+?pere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|mere|age)/i,
      /epouse[:\s]+[^:]+?pere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|mere|age)/i
    ],
    prenomsPereEpoux2: [
      /(?:deuxieme|2e|second)[:\s]+epoux[:\s]+[^:]+?pere[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|mere|age)/i
    ],
    nomMereEpoux2: [
      /(?:deuxieme|2e|second)[:\s]+epoux[:\s]+[^:]+?mere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|age|profession)/i,
      /epouse[:\s]+[^:]+?mere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|age|profession)/i
    ],
    prenomsMereEpoux2: [
      /(?:deuxieme|2e|second)[:\s]+epoux[:\s]+[^:]+?mere[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|age|profession)/i
    ]
  },
  DECES: {
    nomDefunt: [
      /defunt[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|ne|age)/i,
      /décédé[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|ne|age)/i,
      /decede[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|ne|age)/i
    ],
    prenomsDefunt: [
      /defunt[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|ne|age)/i,
      /décédé[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|ne|age)/i
    ],
    dateDeces: [
      /decede[:\s]+le[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
      /décédé[:\s]+le[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
      /deces[:\s]+le[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i
    ],
    lieuDeces: [
      /decede[:\s]+(?:le[:\s]+\d+[\/\-\.]\d+[\/\-\.]\d+[:\s]+)?a[:\s]+([^,\.]+?)(?:,|\.|$)/i,
      /décédé[:\s]+(?:le[:\s]+\d+[\/\-\.]\d+[\/\-\.]\d+[:\s]+)?a[:\s]+([^,\.]+?)(?:,|\.|$)/i,
      /lieu[:\s]+deces[:\s]+([^,\.]+?)(?:,|\.|$)/i
    ],
    nomPereDefunt: [
      /defunt[:\s]+[^:]+?pere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|mere|age)/i,
      /décédé[:\s]+[^:]+?pere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|mere|age)/i
    ],
    prenomsPereDefunt: [/defunt[:\s]+[^:]+?pere[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|mere|age)/i],
    nomMereDefunt: [
      /defunt[:\s]+[^:]+?mere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|age|profession)/i,
      /décédé[:\s]+[^:]+?mere[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$|age|profession)/i
    ],
    prenomsMereDefunt: [/defunt[:\s]+[^:]+?mere[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$|age|profession)/i],
    nomDernierConjoint: [/(?:dernier|veuf|veuve)[:\s]+(?:conjoint|epoux|epouse)[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+prenom|$)/i],
    prenomsDernierConjoint: [
      /(?:dernier|veuf|veuve)[:\s]+(?:conjoint|epoux|epouse)[:\s]+[^:]+?prenom[s]?[:\s]+([a-zàâäéèêëïîôùûüÿç\s-]+?)(?:\s+nom|$)/i
    ]
  }
};

/**
 * Convertit une date extraite du texte en format formulaire
 */
const convertirDate = (dateTexte: string): { jour: string; mois: string; annee: string } | null => {
  const match = dateTexte.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
  if (!match) return null;

  const jour = match[1].padStart(2, "0");
  const mois = match[2].padStart(2, "0");
  const annee = match[3].length === 2 ? `20${match[3]}` : match[3];

  return { jour, mois, annee };
};

/**
 * Génère les suggestions pour un formulaire de vérification
 */
export const genererSuggestions = (
  corpsTexte: string | null | undefined,
  natureActe: "NAISSANCE" | "MARIAGE" | "DECES",
  valeursFormulaire: Record<string, any>
): ISuggestionsVerification => {
  const suggestions: ISuggestionsVerification = {};

  if (!corpsTexte) {
    return suggestions;
  }

  // Traitement selon la nature de l'acte
  switch (natureActe) {
    case "NAISSANCE": {
      const patterns = patternsExtraction.NAISSANCE;
      const traiterChamp = (cheminChamp: string, clePattern: keyof typeof patterns, valeurFormulaire: string) => {
        const valeurExtractee = extraireValeur(corpsTexte, patterns[clePattern]);
        suggestions[cheminChamp] = comparerValeurs(valeurFormulaire || "", valeurExtractee);
      };

      traiterChamp("titulaire.nom", "nomTitulaire", valeursFormulaire.titulaire?.nom || "");
      traiterChamp("titulaire.lieuNaissance.lieuReprise", "lieuNaissance", valeursFormulaire.titulaire?.lieuNaissance?.lieuReprise || "");
      if (valeursFormulaire.titulaire?.dateNaissance) {
        const dateExtractee = extraireValeur(corpsTexte, patterns.dateNaissance);
        if (dateExtractee) {
          const dateConvertie = convertirDate(dateExtractee);
          if (dateConvertie) {
            const dateForm = `${dateConvertie.jour}/${dateConvertie.mois}/${dateConvertie.annee}`;
            const jour = valeursFormulaire.titulaire.dateNaissance.jour || "";
            const mois = valeursFormulaire.titulaire.dateNaissance.mois || "";
            const annee = valeursFormulaire.titulaire.dateNaissance.annee || "";
            const dateFormForm = jour && mois && annee ? `${jour}/${mois}/${annee}` : "";
            if (dateFormForm) {
              suggestions["titulaire.dateNaissance"] = comparerValeurs(dateFormForm, dateForm);
            }
          }
        }
      }
      if (valeursFormulaire.parent1) {
        traiterChamp("parent1.nom", "nomParent1", valeursFormulaire.parent1.nom || "");
      }
      if (valeursFormulaire.parent2) {
        traiterChamp("parent2.nom", "nomParent2", valeursFormulaire.parent2.nom || "");
      }
      break;
    }

    case "MARIAGE": {
      const patterns = patternsExtraction.MARIAGE;
      const traiterChamp = (cheminChamp: string, clePattern: keyof typeof patterns, valeurFormulaire: string) => {
        const valeurExtractee = extraireValeur(corpsTexte, patterns[clePattern]);
        suggestions[cheminChamp] = comparerValeurs(valeurFormulaire || "", valeurExtractee);
      };

      traiterChamp("epoux1.nom", "nomEpoux1", valeursFormulaire.epoux1?.nom || "");
      traiterChamp("epoux2.nom", "nomEpoux2", valeursFormulaire.epoux2?.nom || "");
      traiterChamp("evenement.lieu.lieuReprise", "lieuMariage", valeursFormulaire.evenement?.lieu?.lieuReprise || "");
      if (valeursFormulaire.evenement?.date) {
        const dateExtractee = extraireValeur(corpsTexte, patterns.dateMariage);
        if (dateExtractee) {
          const dateConvertie = convertirDate(dateExtractee);
          if (dateConvertie) {
            const dateForm = `${dateConvertie.jour}/${dateConvertie.mois}/${dateConvertie.annee}`;
            const jour = valeursFormulaire.evenement.date.jour || "";
            const mois = valeursFormulaire.evenement.date.mois || "";
            const annee = valeursFormulaire.evenement.date.annee || "";
            const dateFormForm = jour && mois && annee ? `${jour}/${mois}/${annee}` : "";
            if (dateFormForm) {
              suggestions["evenement.date"] = comparerValeurs(dateFormForm, dateForm);
            }
          }
        }
      }
      if (valeursFormulaire.epoux1?.pere) {
        traiterChamp("epoux1.pere.nom", "nomPereEpoux1", valeursFormulaire.epoux1.pere.nom || "");
      }
      if (valeursFormulaire.epoux1?.mere) {
        traiterChamp("epoux1.mere.nom", "nomMereEpoux1", valeursFormulaire.epoux1.mere.nom || "");
      }
      if (valeursFormulaire.epoux2?.pere) {
        traiterChamp("epoux2.pere.nom", "nomPereEpoux2", valeursFormulaire.epoux2.pere.nom || "");
      }
      if (valeursFormulaire.epoux2?.mere) {
        traiterChamp("epoux2.mere.nom", "nomMereEpoux2", valeursFormulaire.epoux2.mere.nom || "");
      }
      break;
    }

    case "DECES": {
      const patterns = patternsExtraction.DECES;
      const traiterChamp = (cheminChamp: string, clePattern: keyof typeof patterns, valeurFormulaire: string) => {
        const valeurExtractee = extraireValeur(corpsTexte, patterns[clePattern]);
        suggestions[cheminChamp] = comparerValeurs(valeurFormulaire || "", valeurExtractee);
      };

      traiterChamp("defunt.nom", "nomDefunt", valeursFormulaire.defunt?.nom || "");
      traiterChamp("evenement.lieu.lieuReprise", "lieuDeces", valeursFormulaire.evenement?.lieu?.lieuReprise || "");
      if (valeursFormulaire.evenement?.date) {
        const dateExtractee = extraireValeur(corpsTexte, patterns.dateDeces);
        if (dateExtractee) {
          const dateConvertie = convertirDate(dateExtractee);
          if (dateConvertie) {
            const dateForm = `${dateConvertie.jour}/${dateConvertie.mois}/${dateConvertie.annee}`;
            const jour = valeursFormulaire.evenement.date.jour || "";
            const mois = valeursFormulaire.evenement.date.mois || "";
            const annee = valeursFormulaire.evenement.date.annee || "";
            const dateFormForm = jour && mois && annee ? `${jour}/${mois}/${annee}` : "";
            if (dateFormForm) {
              suggestions["evenement.date"] = comparerValeurs(dateFormForm, dateForm);
            }
          }
        }
      }
      if (valeursFormulaire.defunt?.pere) {
        traiterChamp("defunt.pere.nom", "nomPereDefunt", valeursFormulaire.defunt.pere.nom || "");
      }
      if (valeursFormulaire.defunt?.mere) {
        traiterChamp("defunt.mere.nom", "nomMereDefunt", valeursFormulaire.defunt.mere.nom || "");
      }
      if (valeursFormulaire.dernierConjoint) {
        traiterChamp("dernierConjoint.nom", "nomDernierConjoint", valeursFormulaire.dernierConjoint.nom || "");
      }
      break;
    }
  }

  return suggestions;
};

/**
 * Calcule un résumé des suggestions (nombre de champs OK, à vérifier, absents)
 */
export interface IResumeSuggestions {
  identiques: number;
  differents: number;
  introuvables: number;
  total: number;
}

export const calculerResumeSuggestions = (suggestions: ISuggestionsVerification): IResumeSuggestions => {
  const resume: IResumeSuggestions = {
    identiques: 0,
    differents: 0,
    introuvables: 0,
    total: Object.keys(suggestions).length
  };

  Object.values(suggestions).forEach(suggestion => {
    switch (suggestion.etat) {
      case "IDENTIQUE":
        resume.identiques++;
        break;
      case "DIFFERENT":
        resume.differents++;
        break;
      case "INTROUVABLE":
        resume.introuvables++;
        break;
    }
  });

  return resume;
};
