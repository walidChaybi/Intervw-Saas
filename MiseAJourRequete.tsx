import { useContext } from "react";
import { EditionMiseAJourContext } from "../../../contexts/EditionMiseAJourContextProvider";
import ExtractionFeedback from "../../commun/feedback/ExtractionFeedback";
import PartieActe from "./PartieActe";
import PartieFormulaire from "./PartieFormulaire";

const MiseAJourRequete: React.FC = () => {
  const { estActeSigne } = useContext(EditionMiseAJourContext.Valeurs);

  return (
    <>
      <div className="mt-3 flex gap-4 px-2">
        <PartieActe />
        {!estActeSigne && <PartieFormulaire />}
      </div>
      <ExtractionFeedback />
    </>
  );
};

export default MiseAJourRequete;
