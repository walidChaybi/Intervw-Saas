import ChampDate from "@composants/commun/champs/ChampDate";
import ChampsPrenoms from "@composants/commun/champs/ChampsPrenoms";
import ChampTexte from "@composants/commun/champs/ChampTexte";
import ChampVerification from "@composants/commun/champs/ChampVerification";
import ConteneurAvecBordure from "@composants/commun/conteneurs/formulaire/ConteneurAvecBordure";
import { FicheActe } from "@model/etatcivil/acte/FicheActe";
import { Mention } from "@model/etatcivil/acte/mention/Mention";
import { ESexe } from "@model/etatcivil/enum/Sexe";
import { DateHeureFormUtils, IDateHeureForm } from "@model/form/commun/DateForm";
import { PrenomsForm, TPrenomsForm } from "@model/form/commun/PrenomsForm";
import { Formik, useFormikContext } from "formik";
import React, { useMemo } from "react";
import { calculerResumeSuggestions, genererSuggestions } from "../../../../../utils/verificationDonnees";
import ResumeSuggestions from "./ResumeSuggestions";
import VerifierCaseACocher from "./VerifierCaseACocher";

interface IVerificationDonneesNaissanceProps {
  acte: FicheActe | null;
  verificationDonneesEffectuee: boolean;
  setVerificationDonneesEffectuee: (value: boolean) => void;
  miseAJourEffectuee: boolean;
}

interface ILieuNaissance {
  lieuReprise: string;
}

interface IVerificationDonneesForm {
  titulaire: {
    nom: string;
    nomPartie1: string;
    nomPartie2: string;
    prenoms: TPrenomsForm;
    dateNaissance: IDateHeureForm;
    lieuNaissance: ILieuNaissance;
    sexe: keyof typeof ESexe;
  };
  parent1: {
    nom: string;
    prenoms: TPrenomsForm;
    dateNaissance: IDateHeureForm;
    age: string;
    lieuNaissance: ILieuNaissance;
  };
  parent2: {
    nom: string;
    prenoms: TPrenomsForm;
    dateNaissance: IDateHeureForm;
    age: string;
    lieuNaissance: ILieuNaissance;
  };
  informationsComplementaires: {
    nationalite: string;
    mentions: Mention[];
    dateCreation: string;
  };
  verificationEffectuee: boolean;
}

const ContenuVerification: React.FC<{
  acte: FicheActe;
  parent1: ReturnType<(typeof FicheActe.prototype.titulaires)[0]["getParent1"]>;
  parent2: ReturnType<(typeof FicheActe.prototype.titulaires)[0]["getParent2"]>;
  miseAJourEffectuee: boolean;
  verificationDonneesEffectuee: boolean;
  setVerificationDonneesEffectuee: (value: boolean) => void;
}> = ({ acte, parent1, parent2, miseAJourEffectuee, verificationDonneesEffectuee, setVerificationDonneesEffectuee }) => {
  const { values, setFieldValue } = useFormikContext<IVerificationDonneesForm>();

  // Générer les suggestions depuis le corpsTexte
  const suggestions = useMemo(() => {
    if (!acte.corpsTexte?.texte) return {};
    return genererSuggestions(acte.corpsTexte.texte, "NAISSANCE", values);
  }, [acte.corpsTexte?.texte, values]);

  const resume = useMemo(() => calculerResumeSuggestions(suggestions), [suggestions]);

  // Handler pour remplir un champ depuis la suggestion
  const handleRemplir = (cheminChamp: string, valeur: string) => {
    if (cheminChamp.includes("dateNaissance")) {
      // Parser la date au format JJ/MM/AAAA
      const match = valeur.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (match) {
        setFieldValue(`${cheminChamp}.jour`, match[1]);
        setFieldValue(`${cheminChamp}.mois`, match[2]);
        setFieldValue(`${cheminChamp}.annee`, match[3]);
      }
    } else {
      setFieldValue(cheminChamp, valeur);
    }
  };

  return (
    <div className="flex h-[calc(100vh-18rem)] flex-col">
      <div className="space-y-8 overflow-y-auto border border-gray-200 py-6">
        {acte.corpsTexte?.texte && <ResumeSuggestions resume={resume} />}

        {/* Section Titulaire */}
        <ConteneurAvecBordure titreEnTete="Titulaire">
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ChampVerification
                name="titulaire.nom"
                typeChamp="texte"
                libelle="Nom du titulaire"
                estVerrouillable
                suggestion={suggestions["titulaire.nom"]}
                onRemplir={valeur => handleRemplir("titulaire.nom", valeur)}
              />
              <ChampTexte
                name="titulaire.sexe"
                libelle="Sexe"
                estVerrouillable
              />
            </div>

            <ChampsPrenoms
              cheminPrenoms="titulaire.prenoms"
              prefixePrenom="prenom"
              estVerrouillable
            />

            <div className="grid grid-cols-2 gap-4">
              <ChampDate
                name="titulaire.dateNaissance"
                libelle="Date et heure de naissance"
                avecHeure
                estVerrouillable
              />
              <ChampVerification
                name="titulaire.lieuNaissance.lieuReprise"
                typeChamp="texte"
                libelle="Lieu naissance"
                estVerrouillable
                suggestion={suggestions["titulaire.lieuNaissance.lieuReprise"]}
                onRemplir={valeur => handleRemplir("titulaire.lieuNaissance.lieuReprise", valeur)}
              />
            </div>
          </div>
        </ConteneurAvecBordure>

        {/* Section Parent 1 */}
        {parent1 && (
          <ConteneurAvecBordure titreEnTete="Informations du parent 1">
            <div className="mt-4 space-y-4">
              <ChampVerification
                name="parent1.nom"
                typeChamp="texte"
                libelle="Nom"
                estVerrouillable
                suggestion={suggestions["parent1.nom"]}
                onRemplir={valeur => handleRemplir("parent1.nom", valeur)}
              />

              <ChampsPrenoms
                cheminPrenoms="parent1.prenoms"
                prefixePrenom="prenom"
                estVerrouillable
              />

              <div className="grid grid-cols-2 items-start gap-4">
                <ChampDate
                  name="parent1.dateNaissance"
                  libelle="Date de naissance"
                  estVerrouillable
                />

                <ChampTexte
                  name="parent1.age"
                  libelle="Âge"
                  estVerrouillable
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <ChampTexte
                  name="parent1.lieuNaissance.lieuReprise"
                  libelle="Lieu naissance"
                  estVerrouillable
                />
              </div>
            </div>
          </ConteneurAvecBordure>
        )}

        {/* Section Parent 2 */}
        {parent2 && (
          <ConteneurAvecBordure titreEnTete="Informations du parent 2">
            <div className="mt-4 space-y-4">
              <ChampVerification
                name="parent2.nom"
                typeChamp="texte"
                libelle="Nom"
                estVerrouillable
                suggestion={suggestions["parent2.nom"]}
                onRemplir={valeur => handleRemplir("parent2.nom", valeur)}
              />

              <ChampsPrenoms
                cheminPrenoms="parent2.prenoms"
                prefixePrenom="prenom"
                estVerrouillable
              />

              <div className="grid grid-cols-2 gap-4">
                <ChampDate
                  name="parent2.dateNaissance"
                  libelle="Date de naissance"
                  estVerrouillable
                />

                <ChampTexte
                  name="parent2.age"
                  libelle="Âge"
                  estVerrouillable
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <ChampTexte
                  name="parent2.lieuNaissance.lieuReprise"
                  libelle="Lieu naissance"
                  estVerrouillable
                />
              </div>
            </div>
          </ConteneurAvecBordure>
        )}

        {/* Section Informations complémentaires */}
        <ConteneurAvecBordure titreEnTete="Informations complémentaires">
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ChampTexte
                name="informationsComplementaires.nationalite"
                libelle="Nationalité"
                estVerrouillable
              />
              <ChampTexte
                name="informationsComplementaires.dateCreation"
                libelle="Date de création de l'acte"
                estVerrouillable
              />
            </div>

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

const VerificationDonneesNaissance: React.FC<IVerificationDonneesNaissanceProps> = ({
  acte,
  verificationDonneesEffectuee,
  setVerificationDonneesEffectuee,
  miseAJourEffectuee
}) => {
  if (!acte) return null;

  const titulaire = acte.titulaires[0];
  const parent1 = titulaire?.getParent1();
  const parent2 = titulaire?.getParent2();

  const valeursInitiales: IVerificationDonneesForm = {
    titulaire: {
      nom: titulaire?.nom || "",
      nomPartie1: titulaire?.nomPartie1 || "",
      nomPartie2: titulaire?.nomPartie2 || "",
      prenoms: PrenomsForm.depuisStringDto(titulaire?.prenoms || []),
      dateNaissance: DateHeureFormUtils.valeursDefauts(
        {
          jour: titulaire?.naissance?.jour?.toString(),
          mois: titulaire?.naissance?.mois?.toString(),
          annee: titulaire?.naissance?.annee?.toString(),
          heure: titulaire?.naissance?.heure?.toString(),
          minute: titulaire?.naissance?.minute?.toString()
        },
        true
      ),
      lieuNaissance: {
        lieuReprise: titulaire?.naissance?.lieuReprise || ""
      },
      sexe: (titulaire?.sexe as keyof typeof ESexe) || ""
    },
    parent1: {
      nom: parent1?.nom || "",
      prenoms: PrenomsForm.depuisStringDto(parent1?.prenoms || []),
      dateNaissance: DateHeureFormUtils.valeursDefauts({
        jour: parent1?.naissance?.jour?.toString(),
        mois: parent1?.naissance?.mois?.toString(),
        annee: parent1?.naissance?.annee?.toString()
      }),
      age: parent1?.age?.toString() || "",
      lieuNaissance: {
        lieuReprise: parent1?.naissance?.lieuReprise || ""
      }
    },
    parent2: {
      nom: parent2?.nom || "",
      prenoms: PrenomsForm.depuisStringDto(parent2?.prenoms || []),
      dateNaissance: DateHeureFormUtils.valeursDefauts({
        jour: parent2?.naissance?.jour?.toString(),
        mois: parent2?.naissance?.mois?.toString(),
        annee: parent2?.naissance?.annee?.toString()
      }),
      age: parent2?.age?.toString() || "",
      lieuNaissance: {
        lieuReprise: parent2?.naissance?.lieuReprise || ""
      }
    },
    informationsComplementaires: {
      nationalite: "Français",
      mentions: acte.mentions || [],
      dateCreation: acte.dateCreation?.format("JJ/MM/AAAA") ?? ""
    },
    verificationEffectuee: verificationDonneesEffectuee
  };

  return (
    <Formik<IVerificationDonneesForm>
      enableReinitialize
      initialValues={valeursInitiales}
      onSubmit={() => {}}
    >
      <ContenuVerification
        acte={acte}
        parent1={parent1}
        parent2={parent2}
        miseAJourEffectuee={miseAJourEffectuee}
        verificationDonneesEffectuee={verificationDonneesEffectuee}
        setVerificationDonneesEffectuee={setVerificationDonneesEffectuee}
      />
    </Formik>
  );
};

export default VerificationDonneesNaissance;
