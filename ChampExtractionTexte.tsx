import { useField } from "formik";
import React, { useCallback, useEffect, useRef } from "react";
import { VscUnlock } from "react-icons/vsc";
import { useExtractionTexte } from "../../../contexts/ExtractionTexteContextProvider";
import ChampTexte from "./ChampTexte";

interface IChampExtractionTexteProps {
  name: string;
  libelle?: string;
  estVerrouillable?: boolean;
  className?: string;
}

/**
 * Champ de texte avec support pour l'extraction automatique depuis le corpsTexte.
 * Quand ce champ est focusé et que l'utilisateur sélectionne du texte dans le corpsTexte,
 * le texte sélectionné est automatiquement injecté dans ce champ.
 */
const ChampExtractionTexte: React.FC<IChampExtractionTexteProps> = ({ name, libelle, estVerrouillable = true, className }) => {
  const [field, , helper] = useField(name);
  const { champActif, setChampActif, setOnTexteExtrait, clearTexteExtrait } = useExtractionTexte();
  const isActive = champActif === name;
  const inputRef = useRef<HTMLInputElement>(null);

  // Quand le champ est focusé, l'enregistrer comme champ actif
  const handleFocus = useCallback(() => {
    setChampActif(name);
  }, [name, setChampActif]);

  // Enregistrer le callback pour recevoir le texte extrait
  useEffect(() => {
    if (isActive) {
      setOnTexteExtrait((texte: string, champActifParam: string) => {
        if (champActifParam === name) {
          helper.setValue(texte);
          clearTexteExtrait();
        }
      });
    }
  }, [isActive, name, helper, setOnTexteExtrait, clearTexteExtrait]);

  return (
    <div className={`relative ${className || ""}`}>
      {/* Indicateur de champ actif */}
      {isActive && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2">
          <VscUnlock className="h-4 w-4 text-blue-500" />
        </div>
      )}

      <div className={`transition-all duration-200 ${isActive ? "rounded-lg ring-2 ring-blue-400 ring-offset-1" : ""}`}>
        <ChampTexte
          name={name}
          libelle={
            <span className={isActive ? "font-semibold text-blue-600" : ""}>
              {libelle}
              {isActive && " ⚡"}
            </span>
          }
          estVerrouillable={estVerrouillable}
          onFocus={handleFocus}
        />
      </div>
    </div>
  );
};

export default ChampExtractionTexte;
