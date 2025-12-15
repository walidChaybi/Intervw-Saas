import { useField } from "formik";
import React, { useCallback, useMemo } from "react";
import { ISuggestionChamp } from "../../../utils/verificationDonnees";
import Bouton from "../bouton/Bouton";
import ChampDate from "./ChampDate";
import ChampTexte from "./ChampTexte";
import ChampsPrenoms from "./ChampsPrenoms";

interface IChampVerificationProps {
  name: string;
  suggestion?: ISuggestionChamp;
  typeChamp: "texte" | "date" | "prenoms";
  libelle?: string;
  estVerrouillable?: boolean;
  avecHeure?: boolean;
  cheminPrenoms?: string;
  prefixePrenom?: string;
  onRemplir?: (valeur: string) => void; // Callback pour remplir la valeur
  [key: string]: any; // Pour passer les autres props aux champs
}

/**
 * Wrapper pour les champs de vérification avec assistance
 * Affiche l'état de correspondance et permet de remplir automatiquement depuis le corpsTexte
 */
const ChampVerification: React.FC<IChampVerificationProps> = ({
  name,
  suggestion,
  typeChamp,
  libelle,
  estVerrouillable = false,
  avecHeure,
  cheminPrenoms,
  prefixePrenom,
  onRemplir,
  ...props
}) => {
  const [field, , helper] = useField(name);

  const remplirDepuisActe = useCallback(() => {
    if (!suggestion || suggestion.etat === "INTROUVABLE" || !onRemplir) return;

    // Appeler le callback parent pour gérer le remplissage
    onRemplir(suggestion.valeur);
  }, [suggestion, onRemplir]);

  const getCouleurEtat = useMemo(() => {
    if (!suggestion) return "";
    switch (suggestion.etat) {
      case "IDENTIQUE":
        return "text-green-600";
      case "DIFFERENT":
        return "text-orange-600";
      case "INTROUVABLE":
        return "text-gray-500";
      default:
        return "";
    }
  }, [suggestion]);

  const getLibelleEtat = useMemo(() => {
    if (!suggestion) return null;
    switch (suggestion.etat) {
      case "IDENTIQUE":
        return "✓ Correspond";
      case "DIFFERENT":
        return "⚠ Différent";
      case "INTROUVABLE":
        return "? Introuvable";
      default:
        return null;
    }
  }, [suggestion]);

  const afficherSuggestion = suggestion && suggestion.etat !== "INTROUVABLE";

  return (
    <div className="relative">
      {suggestion && (
        <div className={`mb-1 flex items-center gap-2 text-xs ${getCouleurEtat}`}>
          <span>{getLibelleEtat}</span>
          {afficherSuggestion && (
            <span className="text-gray-600">
              {"("}
              {suggestion.valeur}
              {")"}
            </span>
          )}
          {afficherSuggestion && suggestion.etat === "DIFFERENT" && onRemplir && (
            <Bouton
              type="button"
              onClick={remplirDepuisActe}
              className="ml-auto h-6 px-2 text-xs"
              title="Remplir depuis l'acte (déverrouillez d'abord le champ)"
            >
              Remplir
            </Bouton>
          )}
        </div>
      )}

      {typeChamp === "texte" && (
        <ChampTexte
          name={name}
          libelle={libelle}
          estVerrouillable={estVerrouillable}
          {...props}
        />
      )}

      {typeChamp === "date" && (
        <ChampDate
          name={name}
          libelle={libelle || ""}
          estVerrouillable={estVerrouillable}
          avecHeure={avecHeure}
          {...props}
        />
      )}

      {typeChamp === "prenoms" && cheminPrenoms && prefixePrenom && (
        <ChampsPrenoms
          cheminPrenoms={cheminPrenoms}
          prefixePrenom={prefixePrenom}
          estVerrouillable={estVerrouillable}
        />
      )}
    </div>
  );
};

export default ChampVerification;
