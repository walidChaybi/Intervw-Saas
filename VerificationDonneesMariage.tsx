import ChampDate from "@composants/commun/champs/ChampDate";
import ChampsPrenoms from "@composants/commun/champs/ChampsPrenoms";
import ChampTexte from "@composants/commun/champs/ChampTexte";
import ChampVerification from "@composants/commun/champs/ChampVerification";
import ConteneurAvecBordure from "@composants/commun/conteneurs/formulaire/ConteneurAvecBordure";
import { FicheActe } from "@model/etatcivil/acte/FicheActe";
import { Mention } from "@model/etatcivil/acte/mention/Mention";
import { ELienParente } from "@model/etatcivil/enum/ELienParente";
import { DateHeureFormUtils, IDateHeureForm } from "@model/form/commun/DateForm";
import { PrenomsForm, TPrenomsForm } from "@model/form/commun/PrenomsForm";
import { Formik, FormikProps, useFormikContext } from "formik";
import React, { useMemo } from "react";
import { calculerResumeSuggestions, genererSuggestions } from "../../../../../utils/verificationDonnees";
import ResumeSuggestions from "./ResumeSuggestions";
import VerifierCaseACocher from "./VerifierCaseACocher";

interface IVerificationDonneesMariageProps {
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

interface IEpoux {
  nom: string;
  prenoms: TPrenomsForm;
  dateNaissance: IDateHeureForm;
  age: string;
  lieuReprise: ILieu;
  pere: IParent;
  mere: IParent;
  adoptePar: string;
}

interface IVerificationDonneesMariageForm {
  evenement: {
    date: IDateHeureForm;
    lieu: ILieu;
  };
  epoux1: IEpoux;
  epoux2: IEpoux;
  contratMariage: {
    existenceContrat: string;
    enonciations: string;
  };
  informationsComplementaires: {
    mentions: Mention[];
    dateCreation: string;
  };
  verificationEffectuee: boolean;
}

const EpouxSection: React.FC<{
  titre: string;
  prefix: "epoux1" | "epoux2";
  values: FormikProps<IVerificationDonneesMariageForm>["values"];
  suggestions: Record<string, any>;
  onRemplir: (cheminChamp: string, valeur: string) => void;
}> = ({ titre, prefix, values, suggestions, onRemplir }) => (
  <ConteneurAvecBordure titreEnTete={titre}>
    <div className="mt-4 space-y-4">
      <ChampVerification
        name={`${prefix}.nom`}
        typeChamp="texte"
        libelle="Nom"
        estVerrouillable
        suggestion={suggestions[`${prefix}.nom`]}
        onRemplir={valeur => onRemplir(`${prefix}.nom`, valeur)}
      />
      <ChampsPrenoms
        cheminPrenoms={`${prefix}.prenoms`}
        prefixePrenom="prenom"
        estVerrouillable
      />
      <div className="grid grid-cols-2 gap-4">
        <ChampDate
          name={`${prefix}.dateNaissance`}
          libelle="Date de naissance"
          estVerrouillable
        />
        <ChampTexte
          name={`${prefix}.age`}
          libelle="Âge"
          estVerrouillable
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <ChampTexte
          name={`${prefix}.lieuReprise.lieuReprise`}
          libelle="Lieu de naissance"
          estVerrouillable
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <ChampVerification
            name={`${prefix}.pere.nom`}
            typeChamp="texte"
            libelle="Nom du père"
            estVerrouillable
            suggestion={suggestions[`${prefix}.pere.nom`]}
            onRemplir={valeur => onRemplir(`${prefix}.pere.nom`, valeur)}
          />
          <div className="mt-2">
            <ChampsPrenoms
              cheminPrenoms={`${prefix}.pere.prenoms`}
              prefixePrenom="prenom"
              estVerrouillable
            />
          </div>
        </div>
        <div>
          <ChampVerification
            name={`${prefix}.mere.nom`}
            typeChamp="texte"
            libelle="Nom de la mère"
            estVerrouillable
            suggestion={suggestions[`${prefix}.mere.nom`]}
            onRemplir={valeur => onRemplir(`${prefix}.mere.nom`, valeur)}
          />
          <div className="mt-2">
            <ChampsPrenoms
              cheminPrenoms={`${prefix}.mere.prenoms`}
              prefixePrenom="prenom"
              estVerrouillable
            />
          </div>
        </div>
      </div>
      {values[prefix].adoptePar && (
        <ChampTexte
          name={`${prefix}.adoptePar`}
          libelle="Adopté par"
          estVerrouillable
        />
      )}
    </div>
  </ConteneurAvecBordure>
);

const VerificationDonneesMariage: React.FC<IVerificationDonneesMariageProps> = ({
  acte,
  verificationDonneesEffectuee,
  setVerificationDonneesEffectuee,
  miseAJourEffectuee
}) => {
  if (!acte) return null;

  const epoux1 = acte.titulaires[0];
  const epoux2 = acte.titulaires[1];

  const getParentInfo = (titulaire: typeof epoux1, isMere: boolean) => {
    const parent = isMere ? titulaire?.getMere() : titulaire?.getPere();
    return {
      nom: parent?.nom || "",
      prenoms: PrenomsForm.depuisStringDto(parent?.prenoms || [])
    };
  };

  const getAdoptePar = (titulaire: typeof epoux1) => {
    const parentsAdoptants = titulaire?.filiations.filter(
      f => f.lienParente === ELienParente.PARENT_ADOPTANT || f.lienParente === ELienParente.ADOPTANT_CONJOINT_DU_PARENT
    );
    if (!parentsAdoptants || parentsAdoptants.length === 0) return "";
    return parentsAdoptants.map(p => `${p.prenoms.join(" ")} ${p.nom || ""}`.trim()).join(", ");
  };

  const getEpouxInfo = (titulaire: typeof epoux1): IEpoux => ({
    nom: titulaire?.nom || "",
    prenoms: PrenomsForm.depuisStringDto(titulaire?.prenoms || []),
    dateNaissance: DateHeureFormUtils.valeursDefauts({
      jour: titulaire?.naissance?.jour?.toString(),
      mois: titulaire?.naissance?.mois?.toString(),
      annee: titulaire?.naissance?.annee?.toString()
    }),
    age: titulaire?.age?.toString() || "",
    lieuReprise: {
      lieuReprise: titulaire?.naissance?.lieuReprise || ""
    },
    pere: getParentInfo(titulaire, false),
    mere: getParentInfo(titulaire, true),
    adoptePar: getAdoptePar(titulaire)
  });

  const valeursInitiales: IVerificationDonneesMariageForm = {
    evenement: {
      date: DateHeureFormUtils.valeursDefauts({
        jour: acte.evenement?.jour?.toString(),
        mois: acte.evenement?.mois?.toString(),
        annee: acte.evenement?.annee?.toString()
      }),
      lieu: {
        lieuReprise: acte.evenement?.lieuReprise || ""
      }
    },
    epoux1: getEpouxInfo(epoux1),
    epoux2: getEpouxInfo(epoux2),
    contratMariage: {
      existenceContrat: acte.detailMariage?.existenceContrat || "",
      enonciations: acte.detailMariage?.contrat || ""
    },
    informationsComplementaires: {
      mentions: acte.mentions || [],
      dateCreation: acte.dateCreation?.format("JJ/MM/AAAA") ?? ""
    },
    verificationEffectuee: verificationDonneesEffectuee
  };

  return (
    <Formik<IVerificationDonneesMariageForm>
      enableReinitialize
      initialValues={valeursInitiales}
      onSubmit={() => {}}
    >
      <ContenuVerificationMariage
        acte={acte}
        miseAJourEffectuee={miseAJourEffectuee}
        verificationDonneesEffectuee={verificationDonneesEffectuee}
        setVerificationDonneesEffectuee={setVerificationDonneesEffectuee}
      />
    </Formik>
  );
};

const ContenuVerificationMariage: React.FC<{
  acte: FicheActe;
  miseAJourEffectuee: boolean;
  verificationDonneesEffectuee: boolean;
  setVerificationDonneesEffectuee: (value: boolean) => void;
}> = ({ acte, miseAJourEffectuee, verificationDonneesEffectuee, setVerificationDonneesEffectuee }) => {
  const { values, setFieldValue } = useFormikContext<IVerificationDonneesMariageForm>();

  // Générer les suggestions depuis le corpsTexte
  const suggestions = useMemo(() => {
    if (!acte.corpsTexte?.texte) return {};
    return genererSuggestions(acte.corpsTexte.texte, "MARIAGE", values);
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
        <ConteneurAvecBordure titreEnTete="Événement - Mariage">
          <div className="mt-4 space-y-4">
            <ChampDate
              name="evenement.date"
              libelle="Date du mariage"
              estVerrouillable
              avecHeure
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

        <EpouxSection
          titre="Informations de l'époux 1"
          prefix="epoux1"
          values={values}
          suggestions={suggestions}
          onRemplir={handleRemplir}
        />

        <EpouxSection
          titre="Informations de l'époux 2"
          prefix="epoux2"
          values={values}
          suggestions={suggestions}
          onRemplir={handleRemplir}
        />

        {/* Section Contrat de mariage */}
        {(values.contratMariage.existenceContrat || values.contratMariage.enonciations) && (
          <ConteneurAvecBordure titreEnTete="Contrat de mariage">
            <div className="mt-4 space-y-4">
              {values.contratMariage.existenceContrat && (
                <ChampTexte
                  name="contratMariage.existenceContrat"
                  libelle="Existence d'un contrat"
                  estVerrouillable
                />
              )}
              {values.contratMariage.enonciations && (
                <ChampTexte
                  name="contratMariage.enonciations"
                  libelle="Énonciations relatives au contrat de mariage"
                  estVerrouillable
                />
              )}
            </div>
          </ConteneurAvecBordure>
        )}

        {/* Section Informations complémentaires */}
        <ConteneurAvecBordure titreEnTete="Informations complémentaires">
          <div className="mt-4 space-y-4">
            <ChampTexte
              name="informationsComplementaires.dateCreation"
              libelle="Date de création de l'acte"
              estVerrouillable
            />
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

export default VerificationDonneesMariage;
