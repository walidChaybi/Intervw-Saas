import { MdCheck, MdError } from "react-icons/md";
import { useExtractionTexte } from "../../../contexts/ExtractionTexteContextProvider";

/**
 * Composant qui affiche un feedback après extraction de texte
 * Se positionne en bas à droite de l'écran
 */
const ExtractionFeedback: React.FC = () => {
  const { derniereFeedback } = useExtractionTexte();

  if (!derniereFeedback) return null;

  return (
    <div
      className={`animate-bounce-in fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
        derniereFeedback.type === "success" ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      {derniereFeedback.type === "success" ? <MdCheck className="h-4 w-4" /> : <MdError className="h-4 w-4" />}
      {derniereFeedback.message}
    </div>
  );
};

export default ExtractionFeedback;
