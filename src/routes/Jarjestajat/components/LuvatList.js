import _ from 'lodash'
import React, { Component } from 'react'
import Media from 'react-media'

import LupaItem from 'routes/Jarjestajat/components/LupaItem'
import { Table, Thead, Tbody, Th, Tr } from "../../../modules/Table"
import { MEDIA_QUERIES } from "../../../modules/styles"

class LuvatList extends Component {
  renderPermits() {
    const sorted = _.sortBy(this.props.luvat, (lupa) => {
      return lupa.jarjestaja.nimi.fi || lupa.jarjestaja.nimi.sv
    })

    return _.map(sorted, lupa => <LupaItem lupa={lupa} key={lupa.id} />)
  }

  render() {
    return (
      <div>
        <Media query={MEDIA_QUERIES.MOBILE} render={() =>
          <Table>
            <Thead>
            <Tr>
              <Th>Voimassa olevat luvat</Th>
            </Tr>
            </Thead>
            <Tbody>
            {this.renderPermits()}
            </Tbody>
          </Table>
        }/>
        <Media query={MEDIA_QUERIES.TABLET_MIN} render={() =>
          <Table>
            <Thead>
            <Tr>
              <Th>Diaarinumero</Th>
              <Th flex="3">Järjestäjä</Th>
              <Th>Maakunta</Th>
              <Th>Voimassa oleva lupa</Th>
            </Tr>
            </Thead>
            <Tbody>
            {this.renderPermits()}
            </Tbody>
          </Table>
        }/>
      </div>
    )
  }
}

export default LuvatList
