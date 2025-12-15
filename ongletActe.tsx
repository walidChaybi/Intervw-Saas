import { compositionApi } from "@api/appels/compositionApi";
import { CONFIG_GET_DONNEES_POUR_COMPOSITION_ACTE_TEXTE_MIS_A_JOUR } from "@api/configurations/etatCivil/acte/GetDonneesPourCompositionActeTexteMisAJourConfigApi";
import { CONFIG_GET_RESUME_ACTE } from "@api/configurations/etatCivil/acte/GetResumeActeConfigApi";
import AffichageDocument from "@composants/commun/affichageDocument/AffichageDocument";
import Bouton from "@composants/commun/bouton/Bouton";
import OngletsContenu from "@composants/commun/onglets/OngletsContenu";
import { FicheActe } from "@model/etatcivil/acte/FicheActe";
import { useCallback, useContext, useEffect, useState } from "react";
import { MdCheck, MdContentCopy, MdOutlineTouchApp } from "react-icons/md";
import { EditionMiseAJourContext } from "../../../../contexts/EditionMiseAJourContextProvider";
import { useExtractionTexte } from "../../../../contexts/ExtractionTexteContextProvider";
import useFetchApi from "../../../../hooks/api/FetchApiHook";
import { EMimeType } from "../../../../ressources/EMimeType";
import AfficherMessage from "../../../../utils/AfficherMessage";
import { AlertesActes } from "../../../../views/common/composant/alertesActe/AlertesActes";

interface IOngletActeProps {
  estActif: boolean;
}

const OngletActe: React.FC<IOngletActeProps> = ({ estActif }) => {
  const { idActe, estActeSigne } = useContext(EditionMiseAJourContext.Valeurs);
  const { champActif, onTexteSelectionne } = useExtractionTexte();
  const [contenuActe, setContenuActe] = useState<string | null>(null);
  const [acte, setActe] = useState<FicheActe | null>(null);
  const [afficherCorpsTexte, setAfficherCorpsTexte] = useState<boolean>(false);
  const [copie, setCopie] = useState<boolean>(false);
  const [highlight, setHighlight] = useState<boolean>(false);

  const { appelApi: recupererDonneesCompositionActeTexte } = useFetchApi(CONFIG_GET_DONNEES_POUR_COMPOSITION_ACTE_TEXTE_MIS_A_JOUR);
  const { appelApi: getResumeActe } = useFetchApi(CONFIG_GET_RESUME_ACTE);

  // Flash effect when a field is active
  useEffect(() => {
    if (champActif && afficherCorpsTexte) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 300);
      return () => clearTimeout(timer);
    }
  }, [champActif, afficherCorpsTexte]);

  // Handle text selection for extraction
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString();
    if (text && text.trim().length > 0) {
      onTexteSelectionne(text);
      selection?.removeAllRanges();
    }
  }, [onTexteSelectionne]);

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
          <div className="relative flex flex-1 flex-col overflow-hidden rounded border border-gray-300 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
              <span className="text-sm font-semibold text-gray-700">Corps de texte de l'acte</span>
              {champActif && (
                <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  <MdOutlineTouchApp className="h-3 w-3" />
                  Champ actif : {champActif.replace(/_/g, " ")}
                </span>
              )}
            </div>
            {/* Guide visuel */}
            <div className="pointer-events-none absolute right-4 top-12 z-10 rounded border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 opacity-90 shadow-sm">
              ⚡ Surlignez du texte pour remplir le champ actif
            </div>
            <div
              className={`flex-1 cursor-text overflow-y-auto whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed text-gray-800 transition-colors ${highlight ? "bg-blue-50" : "bg-white"}`}
              onMouseUp={handleMouseUp}
            >
              {acte.corpsTexte.texte}
            </div>
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
