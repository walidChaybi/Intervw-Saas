import ChampDate from "@composants/commun/champs/ChampDate";
import ChampsPrenoms from "@composants/commun/champs/ChampsPrenoms";
import ChampTexte from "@composants/commun/champs/ChampTexte";
import ChampVerification from "@composants/commun/champs/ChampVerification";
import ConteneurAvecBordure from "@composants/commun/conteneurs/formulaire/ConteneurAvecBordure";
import { FicheActe } from "@model/etatcivil/acte/FicheActe";
import { Mention } from "@model/etatcivil/acte/mention/Mention";
import { DateHeureFormUtils, IDateHeureForm } from "@model/form/commun/DateForm";
import { PrenomsForm, TPrenomsForm } from "@model/form/commun/PrenomsForm";
import { Formik, useFormikContext } from "formik";
import React, { useMemo } from "react";
import { calculerResumeSuggestions, genererSuggestions } from "../../../../../utils/verificationDonnees";
import ResumeSuggestions from "./ResumeSuggestions";
import VerifierCaseACocher from "./VerifierCaseACocher";

interface IVerificationDonneesDecesProps {
  acte: FicheActe | null;
  verificationDonneesEffectuee: boolean;
  setVerificationDonneesEffectuee: (value: boolean) => void;
  miseAJourEffectuee: boolean;
}

interface ILieu {
  lieuReprise: string;
}

interface IParent {
  nom: string;
  prenoms: TPrenomsForm;
}

interface IVerificationDonneesDecesForm {
  evenement: {
    date: IDateHeureForm;
    lieu: ILieu;
  };
  defunt: {
    nom: string;
    prenoms: TPrenomsForm;
    dateNaissance: IDateHeureForm;
    lieu: ILieu;
    pere: IParent;
    mere: IParent;
  };
  dernierConjoint: {
    nom: string;
    prenoms: TPrenomsForm;
  };
  informationsComplementaires: {
    mentions: Mention[];
    dateCreation: string;
  };
  verificationEffectuee: boolean;
}

const initialiserDate = (jour?: number, mois?: number, annee?: number): IDateHeureForm => {
  return DateHeureFormUtils.valeursDefauts({
    jour: jour?.toString(),
    mois: mois?.toString(),
    annee: annee?.toString()
  });
};

const initialiserPrenoms = (prenoms: string[] | undefined): TPrenomsForm => {
  return PrenomsForm.depuisStringDto(prenoms || []);
};

const InfosParent: React.FC<{
  prefix: string;
  libelleNom: string;
  suggestion?: any;
  onRemplir?: (cheminChamp: string, valeur: string) => void;
}> = ({ prefix, libelleNom, suggestion, onRemplir }) => (
  <div>
    <ChampVerification
      name={`${prefix}.nom`}
      typeChamp="texte"
      libelle={libelleNom}
      estVerrouillable
      suggestion={suggestion}
      onRemplir={valeur => onRemplir?.(`${prefix}.nom`, valeur)}
    />
    <div className="mt-2">
      <ChampsPrenoms
        cheminPrenoms={`${prefix}.prenoms`}
        prefixePrenom="prenom"
        estVerrouillable
      />
    </div>
  </div>
);

const VerificationDonneesDeces: React.FC<IVerificationDonneesDecesProps> = ({
  acte,
  verificationDonneesEffectuee,
  setVerificationDonneesEffectuee,
  miseAJourEffectuee
}) => {
  if (!acte) return null;

  const defunt = acte.titulaires[0];
  const pere = defunt?.getPere();
  const mere = defunt?.getMere();

  const valeursInitiales: IVerificationDonneesDecesForm = {
    evenement: {
      date: initialiserDate(acte.evenement?.jour, acte.evenement?.mois, acte.evenement?.annee),
      lieu: {
        lieuReprise: acte.evenement?.lieuReprise || ""
      }
    },
    defunt: {
      nom: defunt?.nom || "",
      prenoms: initialiserPrenoms(defunt?.prenoms),
      dateNaissance: initialiserDate(defunt?.naissance?.jour, defunt?.naissance?.mois, defunt?.naissance?.annee),
      lieu: {
        lieuReprise: defunt?.naissance?.lieuReprise || ""
      },
      pere: {
        nom: pere?.nom || "",
        prenoms: initialiserPrenoms(pere?.prenoms)
      },
      mere: {
        nom: mere?.nom || "",
        prenoms: initialiserPrenoms(mere?.prenoms)
      }
    },
    dernierConjoint: {
      nom: defunt?.nomDernierConjoint || "",
      prenoms: initialiserPrenoms(defunt?.prenomsDernierConjoint ? [defunt.prenomsDernierConjoint] : [])
    },
    informationsComplementaires: {
      mentions: acte.mentions || [],
      dateCreation: acte.dateCreation?.format("JJ/MM/AAAA") ?? ""
    },
    verificationEffectuee: verificationDonneesEffectuee
  };

  return (
    <Formik<IVerificationDonneesDecesForm>
      enableReinitialize
      initialValues={valeursInitiales}
      onSubmit={() => {}}
    >
      <ContenuVerificationDeces
        acte={acte}
        miseAJourEffectuee={miseAJourEffectuee}
        verificationDonneesEffectuee={verificationDonneesEffectuee}
        setVerificationDonneesEffectuee={setVerificationDonneesEffectuee}
      />
    </Formik>
  );
};

const ContenuVerificationDeces: React.FC<{
  acte: FicheActe;
  miseAJourEffectuee: boolean;
  verificationDonneesEffectuee: boolean;
  setVerificationDonneesEffectuee: (value: boolean) => void;
}> = ({ acte, miseAJourEffectuee, verificationDonneesEffectuee, setVerificationDonneesEffectuee }) => {
  const { values, setFieldValue } = useFormikContext<IVerificationDonneesDecesForm>();

  // Générer les suggestions depuis le corpsTexte
  const suggestions = useMemo(() => {
    if (!acte.corpsTexte?.texte) return {};
    return genererSuggestions(acte.corpsTexte.texte, "DECES", values);
  }, [acte.corpsTexte?.texte, values]);

  const resume = useMemo(() => calculerResumeSuggestions(suggestions), [suggestions]);

  // Handler pour remplir un champ depuis la suggestion
  const handleRemplir = (cheminChamp: string, valeur: string) => {
    setFieldValue(cheminChamp, valeur);
  };

  return (
    <div className="flex h-[calc(100vh-18rem)] flex-col">
      <div className="space-y-8 overflow-y-auto border border-gray-200 py-6">
        {acte.corpsTexte?.texte && <ResumeSuggestions resume={resume} />}

        {/* Section Événement */}
        <ConteneurAvecBordure titreEnTete="Événement - Décès">
          <div className="mt-4 space-y-4">
            <ChampDate
              name="evenement.date"
              libelle="Date du décès"
              estVerrouillable
            />
            <div className="grid grid-cols-3 gap-4">
              <ChampVerification
                name="evenement.lieu.lieuReprise"
                typeChamp="texte"
                libelle="Lieu événement"
                estVerrouillable
                suggestion={suggestions["evenement.lieu.lieuReprise"]}
                onRemplir={valeur => handleRemplir("evenement.lieu.lieuReprise", valeur)}
              />
            </div>
          </div>
        </ConteneurAvecBordure>
        {/* Section Défunt */}
        <ConteneurAvecBordure titreEnTete="Informations de la personne décédée">
          <div className="mt-4 space-y-4">
            <ChampVerification
              name="defunt.nom"
              typeChamp="texte"
              libelle="Nom"
              estVerrouillable
              suggestion={suggestions["defunt.nom"]}
              onRemplir={valeur => handleRemplir("defunt.nom", valeur)}
            />
            <ChampsPrenoms
              cheminPrenoms="defunt.prenoms"
              prefixePrenom="prenom"
              estVerrouillable
            />
            <ChampDate
              name="defunt.dateNaissance"
              libelle="Date de naissance"
              estVerrouillable
            />
            <div className="grid grid-cols-3 gap-4">
              <ChampTexte
                name="defunt.lieu.lieuReprise"
                libelle="Lieu de naissance"
                estVerrouillable
              />
            </div>
          </div>
        </ConteneurAvecBordure>
        {/* Section Parents du défunt */}
        <ConteneurAvecBordure titreEnTete="Filiation de la personne décédée">
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfosParent
                prefix="defunt.pere"
                libelleNom="Nom du père"
                suggestion={suggestions["defunt.pere.nom"]}
                onRemplir={handleRemplir}
              />
              <InfosParent
                prefix="defunt.mere"
                libelleNom="Nom de la mère"
                suggestion={suggestions["defunt.mere.nom"]}
                onRemplir={handleRemplir}
              />
            </div>
          </div>
        </ConteneurAvecBordure>
        {/* Section Dernier conjoint */}
        {(values.dernierConjoint.nom || values.dernierConjoint.prenoms.prenom1) && (
          <ConteneurAvecBordure titreEnTete="Dernier partenaire ou dernier conjoint">
            <div className="mt-4 space-y-4">
              <ChampVerification
                name="dernierConjoint.nom"
                typeChamp="texte"
                libelle="Nom"
                estVerrouillable
                suggestion={suggestions["dernierConjoint.nom"]}
                onRemplir={valeur => handleRemplir("dernierConjoint.nom", valeur)}
              />
              <ChampsPrenoms
                cheminPrenoms="dernierConjoint.prenoms"
                prefixePrenom="prenom"
                estVerrouillable
              />
            </div>
          </ConteneurAvecBordure>
        )}
        {/* Section Informations complémentaires */}
        <ConteneurAvecBordure titreEnTete="Informations complémentaires">
          <div className="mt-4 space-y-4">
            {values.informationsComplementaires.mentions.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {values.informationsComplementaires.mentions.map((mention, index) => (
                  <ChampTexte
                    key={mention.id}
                    name={`informationsComplementaires.mentionTexte${index}`}
                    libelle={`${index + 1}. ${mention.getTexteCopie()}`}
                    estVerrouillable
                  />
                ))}
              </div>
            )}

            <ChampTexte
              name="informationsComplementaires.dateCreation"
              libelle="Date de création de l'acte"
              estVerrouillable
            />
          </div>
        </ConteneurAvecBordure>
        <VerifierCaseACocher
          miseAJourEffectuee={miseAJourEffectuee}
          verificationDonneesEffectuee={verificationDonneesEffectuee}
          setVerificationDonneesEffectuee={setVerificationDonneesEffectuee}
        />
      </div>
    </div>
  );
};

export default VerificationDonneesDeces;
