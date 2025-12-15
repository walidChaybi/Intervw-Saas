import React from "react";
import { IResumeSuggestions } from "../../../../../utils/verificationDonnees";

interface IResumeSuggestionsProps {
  resume: IResumeSuggestions;
}

/**
 * Composant affichant le résumé des suggestions de vérification
 */
const ResumeSuggestions: React.FC<IResumeSuggestionsProps> = ({ resume }) => {
  if (resume.total === 0) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border border-gray-300 bg-gray-50 p-4">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">Résumé de la vérification</h3>
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-green-600">✓</span>
          <span className="text-gray-700">
            {resume.identiques} champ{resume.identiques > 1 ? "s" : ""} correspond{resume.identiques > 1 ? "ent" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-orange-600">⚠</span>
          <span className="text-gray-700">
            {resume.differents} champ{resume.differents > 1 ? "s" : ""} à vérifier
          </span>
        </div>
        {resume.introuvables > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-gray-500">?</span>
            <span className="text-gray-700">
              {resume.introuvables} champ{resume.introuvables > 1 ? "s" : ""} introuvable{resume.introuvables > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeSuggestions;

