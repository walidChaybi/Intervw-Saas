import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { convertirTexteFrancais, determinerTypeChamp, nettoyerTexteSelectionne } from "../utils/conversionTexteFrancais";

/**
 * Context pour gérer l'extraction de texte depuis le corpsTexte
 * et le remplissage automatique des champs du formulaire
 */

interface IExtractionTexteContextValeurs {
  /** Le champ actuellement actif/focusé */
  champActif: string | null;
  /** Le dernier texte extrait */
  texteExtrait: string | null;
  /** Feedback sur la dernière action */
  derniereFeedback: { type: "success" | "error"; message: string } | null;
}

interface IExtractionTexteContextActions {
  /** Définir le champ actif */
  setChampActif: (nomChamp: string | null) => void;
  /** Appelée quand du texte est sélectionné dans le corpsTexte */
  onTexteSelectionne: (texte: string) => void;
  /** Récupérer le texte converti pour le champ actif */
  getTexteConverti: () => string | null;
  /** Nettoyer le texte extrait après utilisation */
  clearTexteExtrait: () => void;
  /** Enregistrer un callback pour quand du texte est extrait */
  setOnTexteExtrait: (callback: ((texte: string, champActif: string) => void) | null) => void;
}

export const ExtractionTexteContext = {
  Valeurs: createContext<IExtractionTexteContextValeurs>({} as IExtractionTexteContextValeurs),
  Actions: createContext<IExtractionTexteContextActions>({} as IExtractionTexteContextActions)
};

interface IExtractionTexteContextProviderProps {
  children: React.ReactNode;
}

const ExtractionTexteContextProvider: React.FC<IExtractionTexteContextProviderProps> = ({ children }) => {
  const [champActif, setChampActif] = useState<string | null>(null);
  const [texteExtrait, setTexteExtrait] = useState<string | null>(null);
  const [derniereFeedback, setDerniereFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [onTexteExtraitCallback, setOnTexteExtraitCallback] = useState<((texte: string, champActif: string) => void) | null>(null);

  // Nettoyer le feedback après 3 secondes
  React.useEffect(() => {
    if (derniereFeedback) {
      const timer = setTimeout(() => setDerniereFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [derniereFeedback]);

  const onTexteSelectionne = useCallback(
    (texte: string) => {
      if (!champActif) {
        setDerniereFeedback({
          type: "error",
          message: "Veuillez d'abord sélectionner un champ dans le formulaire"
        });
        return;
      }

      const texteNettoye = nettoyerTexteSelectionne(texte);
      if (!texteNettoye) return;

      // Déterminer le type de champ et convertir si nécessaire
      const typeChamp = determinerTypeChamp(champActif);
      const texteConverti = convertirTexteFrancais(texteNettoye, typeChamp);

      setTexteExtrait(texteConverti);

      // Appeler le callback si défini
      if (onTexteExtraitCallback) {
        onTexteExtraitCallback(texteConverti, champActif);
      }

      // Feedback
      const estConverti = texteConverti !== texteNettoye;
      setDerniereFeedback({
        type: "success",
        message: estConverti
          ? `Converti : "${texteNettoye.substring(0, 15)}..." → ${texteConverti}`
          : `Copié : "${texteConverti.substring(0, 20)}..."`
      });
    },
    [champActif, onTexteExtraitCallback]
  );

  const getTexteConverti = useCallback(() => {
    return texteExtrait;
  }, [texteExtrait]);

  const clearTexteExtrait = useCallback(() => {
    setTexteExtrait(null);
  }, []);

  const setOnTexteExtrait = useCallback((callback: ((texte: string, champActif: string) => void) | null) => {
    setOnTexteExtraitCallback(() => callback);
  }, []);

  const valeursContext = useMemo<IExtractionTexteContextValeurs>(
    () => ({
      champActif,
      texteExtrait,
      derniereFeedback
    }),
    [champActif, texteExtrait, derniereFeedback]
  );

  const actionsContext = useMemo<IExtractionTexteContextActions>(
    () => ({
      setChampActif,
      onTexteSelectionne,
      getTexteConverti,
      clearTexteExtrait,
      setOnTexteExtrait
    }),
    [onTexteSelectionne, getTexteConverti, clearTexteExtrait, setOnTexteExtrait]
  );

  return (
    <ExtractionTexteContext.Valeurs.Provider value={valeursContext}>
      <ExtractionTexteContext.Actions.Provider value={actionsContext}>{children}</ExtractionTexteContext.Actions.Provider>
    </ExtractionTexteContext.Valeurs.Provider>
  );
};

/**
 * Hook pour utiliser le contexte d'extraction de texte
 */
export const useExtractionTexte = () => {
  const valeurs = useContext(ExtractionTexteContext.Valeurs);
  const actions = useContext(ExtractionTexteContext.Actions);
  return { ...valeurs, ...actions };
};

export default ExtractionTexteContextProvider;
