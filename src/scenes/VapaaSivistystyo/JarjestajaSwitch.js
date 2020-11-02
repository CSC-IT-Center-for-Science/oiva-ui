import React, { useMemo } from "react";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { parseLupa } from "../../utils/lupaParser";
import { equals, isEmpty } from "ramda";
import Loading from "../../modules/Loading";
import { prop } from "ramda";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import education from "../../i18n/definitions/education";
import Jarjestaja from "./components/Jarjestaja";

const JarjestajaSwitch = React.memo(
  ({ lupa, path, user, ytunnus, kielet }) => {
    const intl = useIntl();

    const lupaKohteet = useMemo(() => {
      return !lupa
        ? {}
        : parseLupa({ ...lupa }, intl.formatMessage, intl.locale.toUpperCase());
    }, [lupa, intl]);

    return (
      <React.Fragment>
        <BreadcrumbsItem to="/vapaa-sivistystyo">
          {intl.formatMessage(education.vstEducation)}
        </BreadcrumbsItem>
        <Switch>
          <Route
            path={`${path}`}
            render={props => {
              if (
                lupa &&
                ytunnus === prop("ytunnus", lupa.keyParams) &&
                !isEmpty(lupaKohteet)
              ) {
                return (
                  <Jarjestaja
                    lupaKohteet={lupaKohteet}
                    lupa={lupa}
                    path={path}
                    url={props.match.url}
                    user={user}
                    kielet={kielet}
                  />
                );
              }
              return <Loading />;
            }}
          />
        </Switch>
      </React.Fragment>
    );
  },
  (currentState, nextState) => {
    return (
      equals(currentState.lupa, nextState.lupa) &&
      equals(currentState.user, nextState.user) &&
      equals(currentState.ytunnus, nextState.ytunnus)
    );
  }
);

JarjestajaSwitch.propTypes = {
  path: PropTypes.string,
  ytunnus: PropTypes.string,
  user: PropTypes.object
};

export default JarjestajaSwitch;