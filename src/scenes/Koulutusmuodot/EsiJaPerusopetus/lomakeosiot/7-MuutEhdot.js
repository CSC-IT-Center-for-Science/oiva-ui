import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Lomake from "components/02-organisms/Lomake";
import education from "i18n/definitions/education";
import { useChangeObjects } from "stores/muutokset";

const constants = {
  formLocation: ["esiJaPerusopetus", "muutEhdot"],
  mode: "modification"
};

const MuutEhdot = ({
  code,
  isPreviewModeOn,
  maaraykset,
  mode = constants.mode,
  rajoitteet,
  sectionId,
  title
}) => {
  const intl = useIntl();
  const [, { createTextBoxChangeObject }] = useChangeObjects();

  const onAddButtonClick = useCallback(
    koodiarvo => {
      createTextBoxChangeObject(sectionId, koodiarvo);
    },
    [createTextBoxChangeObject, sectionId]
  );

  return (
    <Lomake
      anchor={sectionId}
      code={code}
      data={{ maaraykset }}
      functions={{ onAddButtonClick }}
      formTitle={title}
      mode={mode}
      isPreviewModeOn={isPreviewModeOn}
      isRowExpanded={true}
      path={constants.formLocation}
      rowTitle={intl.formatMessage(education.muutEhdotTitle)}
      showCategoryTitles={true}
    ></Lomake>
  );
};

MuutEhdot.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  maaraykset: PropTypes.array,
  mode: PropTypes.string,
  rajoitteet: PropTypes.object,
  sectionId: PropTypes.string,
  title: PropTypes.string
};

export default MuutEhdot;
