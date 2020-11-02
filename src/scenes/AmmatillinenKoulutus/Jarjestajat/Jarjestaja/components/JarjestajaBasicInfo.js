import React from "react";
import styled from "styled-components";
import common from "../../../../../i18n/definitions/common";
import education from "../../../../../i18n/definitions/education";
import { useIntl } from "react-intl";
import { split, join, replace } from "ramda";
import { Typography } from "@material-ui/core";

const LargeParagraph = styled.p`
  font-size: 20px;
  line-height: 24px;
  margin: 0;
`;

const JarjestajaBasicInfo = ({ jarjestaja }) => {
  const intl = useIntl();
  const ytunnusTitle = `${intl.formatMessage(common.ytunnus)}: `;
  const ytunnusVoiceOverSpelling = replace(
    "-",
    intl.formatMessage(common.viiva),
    join(" ", split("", jarjestaja.ytunnus))
  );
  const ariaLabel = `${ytunnusTitle}: ${ytunnusVoiceOverSpelling}`;

  return (
    <React.Fragment>
      <Typography component="h2" variant="h4" className="pb-4 mt--12">
        {intl.formatMessage(education.koulutuksenJarjestaja)}
      </Typography>

      <LargeParagraph aria-label={ariaLabel} role="text">
        {ytunnusTitle} {jarjestaja.ytunnus}
      </LargeParagraph>
    </React.Fragment>
  );
};

export default JarjestajaBasicInfo;