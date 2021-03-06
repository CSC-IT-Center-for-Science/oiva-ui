import React from "react";
import { MUUTOS_WIZARD_TEKSTIT } from "../../modules/constants";
import FormSection from "../../../../../../../../../components/03-templates/FormSection";
import TaloudellisetYleisettiedot from "../Taloudelliset/TaloudellisetYleisettiedot";
import TaloudellisetInvestoinnit from "../Taloudelliset/TaloudellisetInvestoinnit";
import TaloudellisetTilinpaatostiedot from "../Taloudelliset/TaloudellisetTilinpaatostiedot";
import TaloudellisetLiitteet from "../Taloudelliset/TaloudellisetLiitteet";
import PropTypes from "prop-types";
import * as R from "ramda";
import { Typography } from "@material-ui/core";

const YhteenvetoTaloudelliset = ({
  changeObjects,
  muutoshakemus,
  onChangesUpdate
}) => {
  return (
    <React.Fragment>
      <Typography component="h2" variant="h2">
        {MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.PAAOTSIKKO.FI}
      </Typography>

      {!changeObjects && (
        <p>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.EI_LISATTYJA_TUTKINTOJA.FI}</p>
      )}
      {changeObjects && (
        <React.Fragment>
          <FormSection
            className="my-0"
            id="taloudelliset_yleisettiedot"
            render={_props => (
              <React.Fragment>
                <TaloudellisetYleisettiedot
                  changeObjects={R.path(
                    ["taloudelliset", "yleisettiedot"],
                    changeObjects
                  )}
                  isReadOnly={true}
                  {..._props}
                />
              </React.Fragment>
            )}
            runOnChanges={onChangesUpdate}
          />
          <FormSection
            id="taloudelliset_investoinnit"
            render={_props => (
              <React.Fragment>
                <TaloudellisetInvestoinnit
                  changeObjects={R.path(
                    ["taloudelliset", "investoinnit"],
                    changeObjects
                  )}
                  isReadOnly={true}
                  {..._props}
                />
              </React.Fragment>
            )}
            runOnChanges={onChangesUpdate}
          />
          <FormSection
            id="taloudelliset_tilinpaatostiedot"
            render={_props => (
              <React.Fragment>
                <TaloudellisetTilinpaatostiedot
                  changeObjects={R.path(
                    ["taloudelliset", "tilinpaatostiedot"],
                    changeObjects
                  )}
                  isReadOnly={true}
                  {..._props}
                />
              </React.Fragment>
            )}
            runOnChanges={onChangesUpdate}
          />
          <FormSection
            id="taloudelliset_liitteet"
            render={_props => (
              <React.Fragment>
                <TaloudellisetLiitteet
                  sectionId={"taloudelliset_liitteet"}
                  changeObjects={R.path(
                    ["taloudelliset", "liitteet"],
                    changeObjects
                  )}
                  isReadOnly={true}
                  {..._props}
                />
              </React.Fragment>
            )}
            runOnChanges={onChangesUpdate}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

YhteenvetoTaloudelliset.propTypes = {
  changeObjects: PropTypes.object,
  muutoshakemus: PropTypes.object,
  onChangesUpdate: PropTypes.func
};

export default YhteenvetoTaloudelliset;
