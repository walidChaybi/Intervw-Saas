import { ErrorMessage, useField } from "formik";
import { Ref, useCallback, useEffect, useState } from "react";
import { VscLock, VscUnlock } from "react-icons/vsc";
import { useExtractionTexte } from "../../../contexts/ExtractionTexteContextProvider";
import { CHAMP_EN_ERREUR } from "../formulaire/ScrollVersErreur";

type TFormatChampsTexte = "PREMIER_MAJUSCULE" | "NOMS_PROPRES" | "MAJUSCULES" | "SANS_ESPACES";

interface IBoutonIcon {
  composant?: JSX.Element;
  estAGauche?: boolean;
}

type TChampsTexteProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  libelle?: string | React.ReactNode;
  numerique?: boolean;
  optionFormatage?: TFormatChampsTexte;
  estObligatoire?: boolean;
  boutonChamp?: IBoutonIcon;
  regex?: RegExp;
  refChamp?: Ref<HTMLInputElement>;
  estVerrouillable?: boolean;
  /** Active le mode extraction - le champ peut recevoir du texte sélectionné depuis le corpsTexte */
  modeExtraction?: boolean;
};

const ChampTexte: React.FC<TChampsTexteProps> = ({
  name,
  libelle,
  className,
  maxLength,
  numerique,
  optionFormatage,
  estObligatoire,
  boutonChamp = {
    composant: <></>,
    estAGauche: false
  },
  regex,
  refChamp,
  estVerrouillable = false,
  modeExtraction = false,
  ...props
}) => {
  const [field, meta, helper] = useField(name);
  const enErreur = Boolean(meta.error) && meta.touched;

  const [estVerrouille, setEstVerrouille] = useState(estVerrouillable);

  // Hook pour l'extraction de texte (conditionnel)
  const extractionTexte = useExtractionTexte();
  const estChampActif = modeExtraction && extractionTexte?.champActif === name;

  // Gérer le focus pour l'extraction
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (modeExtraction && extractionTexte?.setChampActif) {
        extractionTexte.setChampActif(name);
      }
      props.onFocus?.(event);
    },
    [modeExtraction, extractionTexte, name, props.onFocus]
  );

  // Écouter le texte extrait et le remplir si ce champ est actif
  useEffect(() => {
    if (modeExtraction && estChampActif && extractionTexte?.texteExtrait) {
      // Déverrouiller le champ si verrouillé
      if (estVerrouille) {
        setEstVerrouille(false);
      }
      helper.setValue(extractionTexte.texteExtrait);
      extractionTexte.clearTexteExtrait();
    }
  }, [modeExtraction, estChampActif, extractionTexte?.texteExtrait, helper, estVerrouille]);

  const formaterValeur = useCallback(
    (valeur: string): string => {
      if (!valeur) return "";
      switch (optionFormatage) {
        case "PREMIER_MAJUSCULE":
          return valeur.charAt(0).toUpperCase() + valeur.slice(1).toLowerCase();
        case "NOMS_PROPRES":
          return valeur.toLowerCase().replace(/(?:^|\s|-)\p{L}/gu, l => l.toUpperCase());
        case "MAJUSCULES":
          return valeur.toUpperCase();
        case "SANS_ESPACES":
          return valeur.replace(/\s+/g, "");
        default:
          return valeur;
      }
    },
    [optionFormatage]
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const valeurFormatee = formaterValeur(event.target.value.trim());
      field.onBlur(event);
      helper.setValue(valeurFormatee);
    },
    [formaterValeur, field, helper]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let valeur = event.target.value;

      if (numerique) {
        valeur = valeur.replace(/\D/g, "");
      } else if (regex) {
        valeur = valeur.replace(regex, "");
      }

      helper.setValue(valeur);
    },
    [estVerrouille, helper, numerique, regex]
  );

  const basculerVerrouillage = useCallback(() => {
    setEstVerrouille(valeurActuel => !valeurActuel);
  }, []);

  return (
    <div
      className={`flex w-full flex-col text-start ${libelle ? "" : "justify-end"} ${className ?? ""} ${enErreur ? CHAMP_EN_ERREUR : ""} ${estChampActif ? "relative" : ""}`.trim()}
    >
      {libelle && (
        <label
          className={`m-0 mb-1 ml-1 block w-fit text-start transition-colors ${enErreur ? "text-rouge" : estChampActif ? "font-semibold text-blue-600" : "text-bleu-sombre"}`}
          htmlFor={name}
        >
          {libelle}
          {estChampActif && <span className="ml-1">⚡</span>}
          {estObligatoire && <span className="ml-1 text-rouge">*</span>}
        </label>
      )}
      <div className={`relative flex rounded-md shadow-sm ${estChampActif ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}>
        <input
          {...field}
          {...props}
          id={name}
          ref={refChamp}
          maxLength={maxLength}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          readOnly={estVerrouillable ? estVerrouille : props.readOnly}
          className={`border-1 flex w-full flex-grow rounded border border-solid px-2 py-1 read-only:bg-gris/60 read-only:text-black/60 ${boutonChamp?.estAGauche ? "pl-12" : ""} transition-colors read-only:bg-gris-clair focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-opacity-70 ${enErreur ? "border-rouge focus-visible:ring-rouge" : "border-gris focus-visible:ring-bleu"}`}
        />
        {estVerrouillable && (
          <button
            onClick={basculerVerrouillage}
            className="group absolute right-0 top-0 m-0 flex h-9 w-12 min-w-4 items-center justify-center bg-transparent text-xl"
          >
            {estVerrouille ? (
              <VscLock className="text-gris-sombre read-only:text-black/60 group-hover:text-bleu" />
            ) : (
              <VscUnlock className="text-bleu-sombre" />
            )}
          </button>
        )}
        {boutonChamp.composant}
      </div>
      {meta.error && (
        <div className="text-start text-sm text-rouge">
          <ErrorMessage name={name ?? ""} />
        </div>
      )}
    </div>
  );
};

export default ChampTexte;
