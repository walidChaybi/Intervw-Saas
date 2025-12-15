import { compositionApi } from "@api/appels/compositionApi";
import { CONFIG_GET_DONNEES_POUR_COMPOSITION_ACTE_TEXTE_MIS_A_JOUR } from "@api/configurations/etatCivil/acte/GetDonneesPourCompositionActeTexteMisAJourConfigApi";
import { CONFIG_GET_RESUME_ACTE } from "@api/configurations/etatCivil/acte/GetResumeActeConfigApi";
import AffichageDocument from "@composants/commun/affichageDocument/AffichageDocument";
import Bouton from "@composants/commun/bouton/Bouton";
import OngletsContenu from "@composants/commun/onglets/OngletsContenu";
import { FicheActe } from "@model/etatcivil/acte/FicheActe";
import { useCallback, useContext, useEffect, useState } from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { EditionMiseAJourContext } from "../../../../contexts/EditionMiseAJourContextProvider";
import useFetchApi from "../../../../hooks/api/FetchApiHook";
import { EMimeType } from "../../../../ressources/EMimeType";
import AfficherMessage from "../../../../utils/AfficherMessage";
import { AlertesActes } from "../../../../views/common/composant/alertesActe/AlertesActes";

interface IOngletActeProps {
  estActif: boolean;
}

const OngletActe: React.FC<IOngletActeProps> = ({ estActif }) => {
  const { idActe, estActeSigne } = useContext(EditionMiseAJourContext.Valeurs);
  const [contenuActe, setContenuActe] = useState<string | null>(null);
  const [acte, setActe] = useState<FicheActe | null>(null);
  const [afficherCorpsTexte, setAfficherCorpsTexte] = useState<boolean>(false);
  const [copie, setCopie] = useState<boolean>(false);

  const { appelApi: recupererDonneesCompositionActeTexte } = useFetchApi(CONFIG_GET_DONNEES_POUR_COMPOSITION_ACTE_TEXTE_MIS_A_JOUR);
  const { appelApi: getResumeActe } = useFetchApi(CONFIG_GET_RESUME_ACTE);

  useEffect(() => {
    if (!idActe) return;

    getResumeActe({
      parametres: {
        path: { idActe },
        query: { remplaceIdentiteTitulaireParIdentiteTitulaireAM: true }
      },
      apresSucces: acteDto => {
        setActe(FicheActe.depuisDto(acteDto));
      },
      apresErreur: erreurs =>
        AfficherMessage.erreur("Une erreur est survenue lors de la récupération des informations de l'acte", { erreurs })
    });
  }, [idActe]);

  useEffect(() => {
    if (!idActe || (contenuActe !== null && !estActeSigne)) return;

    recupererDonneesCompositionActeTexte({
      parametres: { path: { idActe } },
      apresSucces: donneesPourCompositionActeTexte => {
        compositionApi
          .getCompositionActeTexte(donneesPourCompositionActeTexte)
          .then(dataComposition => setContenuActe(dataComposition.body.data.contenu ?? ""));
      },
      apresErreur: erreurs =>
        AfficherMessage.erreur("Une erreur est survenue lors de la récupération de l'acte texte.", {
          erreurs
        })
    });
  }, [idActe, estActeSigne]);

  const aCorpsTexte = acte?.corpsTexte?.texte && acte.corpsTexte.texte.trim().length > 0;

  const copierTexte = useCallback(() => {
    if (acte?.corpsTexte?.texte) {
      navigator.clipboard.writeText(acte.corpsTexte.texte).then(() => {
        setCopie(true);
        setTimeout(() => setCopie(false), 2000);
      });
    }
  }, [acte?.corpsTexte?.texte]);

  return (
    <OngletsContenu estActif={estActif}>
      <div className="flex h-[calc(100vh-16rem)] flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <AlertesActes idActeInit={idActe} />
          {aCorpsTexte && (
            <div className="ml-auto flex gap-2">
              {afficherCorpsTexte && (
                <Bouton
                  type="button"
                  onClick={copierTexte}
                  styleBouton="secondaire"
                  className="flex items-center gap-1"
                  title="Copier le texte dans le presse-papier"
                >
                  {copie ? (
                    <>
                      <MdCheck className="text-green-600" />
                      {"Copié !"}
                    </>
                  ) : (
                    <>
                      <MdContentCopy />
                      {"Copier"}
                    </>
                  )}
                </Bouton>
              )}
              <Bouton
                type="button"
                onClick={() => setAfficherCorpsTexte(!afficherCorpsTexte)}
                styleBouton="principal"
              >
                {afficherCorpsTexte ? "Voir PDF" : "Voir texte de l'acte"}
              </Bouton>
            </div>
          )}
        </div>
        {afficherCorpsTexte && aCorpsTexte ? (
          <div className="flex flex-1 flex-col overflow-hidden rounded border border-gray-300 bg-white">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
              <span className="text-sm font-semibold text-gray-700">Corps de texte de l'acte (corpsTexte)</span>
            </div>
            <textarea
              className="flex-1 resize-none border-none p-4 font-mono text-sm text-gray-800 focus:outline-none focus:ring-0"
              value={acte.corpsTexte.texte}
              readOnly
              onClick={e => (e.target as HTMLTextAreaElement).select()}
            />
          </div>
        ) : (
          <AffichageDocument
            contenuBase64={contenuActe}
            typeZoom={90}
            typeMime={EMimeType.APPLI_PDF}
          />
        )}
      </div>
    </OngletsContenu>
  );
};

export default OngletActe;
