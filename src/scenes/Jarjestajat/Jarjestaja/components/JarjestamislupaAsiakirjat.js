import * as R from "ramda";
import React, { useContext, useMemo } from "react";
import Media from "react-media";
import styled from "styled-components";
import { Table, Tbody, Thead, Thn, Trn } from "../../../../modules/Table";
import { MEDIA_QUERIES } from "../../../../modules/styles";
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants";
import JarjestamislupaAsiakirjatItem from "./JarjestamislupaAsiakirjatItem";
import { Typography } from "@material-ui/core";
import common from "../../../../i18n/definitions/common";
import PropTypes from "prop-types";
import FetchHandler from "../../../../FetchHandler";
import { BackendContext } from "../../../../context/backendContext";
import Moment from "react-moment";

const WrapTable = styled.div``;

const titleKeys = [
  common.document,
  common.documentStatus,
  common.author,
  common.sent
];

const JarjestamislupaAsiakirjat = ({muutospyynto, organisaatio, intl}) => {

  const { state: fromBackend, dispatch } = useContext(BackendContext);
  const fetchSetup = useMemo(() => {
    return muutospyynto && muutospyynto.uuid
      ? [{
          key: "muutospyynnonLiitteet",
          dispatchFn: dispatch,
          urlEnding: muutospyynto.uuid
        }]
      : [];
  }, [dispatch, muutospyynto]);

  const baseRow = [
    LUPA_TEKSTIT.MUUTOSPYYNTO.TILA[muutospyynto.tila][R.toUpper(intl.locale)],
    R.path(["nimi", intl.locale], organisaatio)
  ];

  const liitteetRowItems = useMemo(() => R.map((liite) =>
    ({
      items:
        [
          intl.formatMessage(liite.salainen ? common.secretAttachment : common.attachment) + " " + R.prop("nimi", liite),
          ...baseRow,
          liite.luontipvm
            ? (<Moment format="D.M.YYYY">{liite.luontipvm}</Moment>)
            : ""
        ],
      fileLink: `/api/liitteet/${liite.uuid}/raw`
    }), R.pathOr([], ['muutospyynnonLiitteet', 'raw'], fromBackend)
  ), [fromBackend.muutospyynnonLiitteet]);

  const muutospyyntoRowItem = {
    fileLink: `/api/pdf/esikatsele/muutospyynto/${muutospyynto.uuid}`,
    items: [
      intl.formatMessage(common.application),
      ...baseRow,
      ""
    ]
  };

  const jarjestamislupaAsiakirjatList = () => {
    return R.addIndex(R.map)((row, idx) => (
      <a href={row.fileLink} target="_blank" rel="noopener noreferrer" key = { idx }>
        <JarjestamislupaAsiakirjatItem
          rowItems = { row.items }
        />
      </a>
    ), [muutospyyntoRowItem, ...liitteetRowItems]);
  };

  return (
    <FetchHandler
      fetchSetup={fetchSetup}
      ready={
        <WrapTable>
          <Media
            query={MEDIA_QUERIES.MOBILE}
            render={() => (
              <Table>
                <Tbody>{jarjestamislupaAsiakirjatList()}</Tbody>
              </Table>
            )}
          />
          <Media
            query={MEDIA_QUERIES.TABLET_MIN}
            render={() => (
              <Table>
                <Thead>
                  <Trn>
                    {
                      titleKeys.map((title, ind) => (
                        <Thn key={ind}>
                          <Typography>{intl.formatMessage(title)}</Typography>
                        </Thn>)
                      )
                    }
                  </Trn>
                </Thead>
                <Tbody>{jarjestamislupaAsiakirjatList()}</Tbody>
              </Table>
            )}
          />
        </WrapTable>
      }
      />
  );
};

JarjestamislupaAsiakirjat.propTypes = {
  match: PropTypes.object,
  muutospyynto: PropTypes.object,
  organisaatio: PropTypes.object,
  intl: PropTypes.object
};

export default JarjestamislupaAsiakirjat;
