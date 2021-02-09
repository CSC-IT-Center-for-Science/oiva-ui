import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useHistory, useParams } from "react-router-dom";
import { parseLupa } from "../../../utils/lupaParser";
import { isEmpty, prop, toUpper } from "ramda";
import { Wizard } from "components/03-templates/Wizard";
import wizard from "i18n/definitions/wizard";
import EsittelijatMuutospyynto from "./EsittelijatMuutospyynto";
import common from "i18n/definitions/common";
import MuutospyyntoWizardTaloudelliset from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardTaloudelliset";
import MuutospyyntoWizardYhteenveto from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardYhteenveto";
import { createMuutospyyntoOutput } from "services/muutoshakemus/utils/common";
import { createObjectToSave } from "helpers/ammatillinenKoulutus/tallentaminen/esittelijat";
import {
  useChangeObjects,
  useChangeObjectsByAnchorWithoutUnderRemoval
} from "stores/muutokset";
import { useAllSections } from "stores/lomakedata";
import ProcedureHandler from "components/02-organisms/procedureHandler/index";
import { useMuutospyynto } from "stores/muutospyynto";
import { getSavedChangeObjects } from "helpers/ammatillinenKoulutus/commonUtils";
import { API_BASE_URL } from "modules/constants";
import { backendRoutes } from "stores/utils/backendRoutes";

/**
 * Container component of Wizard.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const WizardContainer = ({
  kohteet,
  koulutukset,
  koulutusalat,
  koulutustyypit,
  maaraystyypit,
  muut,
  organisaatio,
  role,
  viimeisinLupa
}) => {
  const intl = useIntl();

  let { id, uuid } = useParams();
  let history = useHistory();

  const [lomakedata] = useAllSections();
  const [muutospyynto, setMuutospyynto] = useState();

  // Relevantit muutosobjektit osioittain (tarvitaan tallennettaessa)
  const [topThreeCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "topthree"
  });
  const [tutkinnotCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "tutkinnot"
  });
  const [koulutuksetCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "koulutukset"
  });
  const [opetuskieletCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "kielet_opetuskielet"
  });
  const [tutkintokieletCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "kielet_tutkintokielet"
  });
  const [toimintaalueCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "toimintaalue"
  });
  const [opiskelijavuodetCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opiskelijavuodet"
  });
  const [muutCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "muut"
  });

  useEffect(() => {
    async function fetchMuutospyynto() {
      const response = await fetch(
        `${API_BASE_URL}/${backendRoutes.muutospyynto.path}${uuid}`
      );
      if (response && response.ok) {
        setMuutospyynto(await response.json());
      }
      return muutospyynto;
    }

    if (!muutospyynto && uuid) {
      fetchMuutospyynto();
    }
  }, [muutospyynto, uuid]);

  const [, { initializeChanges }] = useChangeObjects();

  const [, muutospyyntoActions] = useMuutospyynto();

  const lupaKohteet = useMemo(() => {
    const result = !isEmpty(viimeisinLupa)
      ? parseLupa(
          { ...viimeisinLupa },
          intl.formatMessage,
          intl.locale.toUpperCase()
        )
      : {};
    return result;
  }, [viimeisinLupa, intl]);

  useEffect(() => {
    const changeObjectsFromBackend = getSavedChangeObjects(muutospyynto);
    initializeChanges(changeObjectsFromBackend);
  }, [muutospyynto, initializeChanges]);

  const onNewDocSave = useCallback(
    uuid => {
      /**
       * User is redirected to the url of the saved document.
       */
      history.push(`/ammatillinenkoulutus/asianhallinta/${id}/${uuid}/1`);
    },
    [history, id]
  );

  /**
   * Opens the preview.
   * @param {object} formData
   */
  const onPreview = useCallback(
    async formData => {
      const procedureHandler = new ProcedureHandler(intl.formatMessage);
      /**
       * Let's save the form without notification. Notification about saving isn't
       * needed when we're going to show a notification related to the preview.
       */
      const outputs = await procedureHandler.run(
        "muutospyynto.tallennus.tallennaEsittelijanToimesta",
        [formData, false] // false = Notification of save success won't be shown.
      );
      const muutospyynto =
        outputs.muutospyynto.tallennus.tallennaEsittelijanToimesta.output
          .result;
      // Let's get the path of preview (PDF) document and download the file.
      const path = await muutospyyntoActions.getLupaPreviewDownloadPath(
        muutospyynto.uuid
      );
      if (path) {
        muutospyyntoActions.download(path, intl.formatMessage);
      }
      return muutospyynto;
    },
    [intl.formatMessage, muutospyyntoActions]
  );

  /**
   * Saves the form.
   * @param {object} formData
   * @returns {object} - Muutospyyntö
   */
  const onSave = useCallback(
    async formData => {
      const procedureHandler = new ProcedureHandler(intl.formatMessage);
      const outputs = await procedureHandler.run(
        "muutospyynto.tallennus.tallennaEsittelijanToimesta",
        [formData]
      );
      return outputs.muutospyynto.tallennus.tallennaEsittelijanToimesta.output
        .result;
    },
    [intl.formatMessage]
  );

  // KJ eli koulutuksen järjestäjä on velvolliinen perustelemaan hakemansa
  // muutokset, esittelijä ei ole. Siksi esittelijän tarvitsee täyttää vain
  // lomakewizardin ensimmäinen sivu.
  const [steps] = useState(
    role === "KJ"
      ? [
          {
            title: intl.formatMessage(wizard.pageTitle_1)
          },
          {
            title: intl.formatMessage(wizard.pageTitle_2)
          },
          {
            title: intl.formatMessage(wizard.pageTitle_3)
          },
          {
            title: intl.formatMessage(wizard.pageTitle_4)
          }
        ]
      : null
  );

  const onAction = useCallback(
    async (action, fromDialog = false) => {
      const formData = createMuutospyyntoOutput(
        await createObjectToSave(
          toUpper(intl.locale),
          organisaatio,
          viimeisinLupa,
          {
            koulutukset: koulutuksetCO,
            muut: muutCO,
            opetuskielet: opetuskieletCO,
            opiskelijavuodet: opiskelijavuodetCO,
            toimintaalue: toimintaalueCO,
            topthree: topThreeCO,
            tutkinnot: tutkinnotCO,
            tutkintokielet: tutkintokieletCO
          },
          uuid,
          kohteet,
          maaraystyypit,
          muut,
          lupaKohteet,
          lomakedata
        )
      );

      let muutospyynto = null;

      if (action === "save") {
        muutospyynto = await onSave(formData);
      } else if (action === "preview") {
        muutospyynto = await onPreview(formData);
      }

      if (!!muutospyynto && prop("uuid", muutospyynto)) {
        if (!uuid && !fromDialog && !!onNewDocSave) {
          // Jos kyseessä on ensimmäinen tallennus...
          onNewDocSave(muutospyynto.uuid);
        } else {
          /**
           * Kun muutospyyntolomakkeen tilaa muokataan tässä vaiheessa,
           * vältytään tarpeelta tehdä sivun täydellistä uudelleen latausta.
           **/
          const changeObjectsFromBackend = getSavedChangeObjects(muutospyynto);
          initializeChanges(changeObjectsFromBackend);
        }
      }
    },
    [
      kohteet,
      initializeChanges,
      intl.locale,
      koulutuksetCO,
      lomakedata,
      viimeisinLupa,
      lupaKohteet,
      maaraystyypit,
      muut,
      muutCO,
      onNewDocSave,
      onPreview,
      onSave,
      opetuskieletCO,
      opiskelijavuodetCO,
      organisaatio,
      toimintaalueCO,
      topThreeCO,
      tutkinnotCO,
      tutkintokieletCO,
      uuid
    ]
  );

  return (
    <Wizard
      page1={
        <EsittelijatMuutospyynto
          kohteet={kohteet}
          koulutukset={koulutukset}
          koulutusalat={koulutusalat}
          koulutustyypit={koulutustyypit}
          maaraykset={viimeisinLupa.maaraykset}
          lupaKohteet={lupaKohteet}
          maaraystyypit={maaraystyypit}
          mode={"modification"}
          muut={muut}
          role={role}
          title={intl.formatMessage(common.changesText)}
        />
      }
      page2={
        role === "KJ" ? (
          <EsittelijatMuutospyynto
            kohteet={kohteet}
            koulutukset={koulutukset}
            koulutusalat={koulutusalat}
            koulutustyypit={koulutustyypit}
            maaraykset={viimeisinLupa.maaraykset}
            lupaKohteet={lupaKohteet}
            maaraystyypit={maaraystyypit}
            mode={"reasoning"}
            muut={muut}
            role={role}
            title={intl.formatMessage(wizard.pageTitle_2)}
          />
        ) : null
      }
      page3={
        role === "KJ" ? (
          <MuutospyyntoWizardTaloudelliset
            isReadOnly={false}
            // isFirstVisit={visitsPerPage[3] === 1}
          />
        ) : null
      }
      page4={
        role === "KJ" ? (
          <MuutospyyntoWizardYhteenveto
            history={history}
            kohteet={kohteet}
            koulutukset={koulutukset}
            koulutusalat={koulutusalat}
            koulutustyypit={koulutustyypit}
            lupa={viimeisinLupa}
            lupaKohteet={lupaKohteet}
            maaraykset={viimeisinLupa.maaraykset}
            maaraystyypit={maaraystyypit}
            mode="reasoning"
            muut={muut}
            // isFirstVisit={visitsPerPage[4] === 1}
          />
        ) : null
      }
      onAction={onAction}
      organisation={organisaatio}
      steps={steps}
      title={intl.formatMessage(wizard.esittelijatMuutospyyntoDialogTitle)}
      urlOnClose={
        role === "KJ"
          ? `../../../${id}/jarjestamislupa-asiat`
          : "/ammatillinenkoulutus/asianhallinta/avoimet?force=true"
      }
    />
  );
};

export default WizardContainer;