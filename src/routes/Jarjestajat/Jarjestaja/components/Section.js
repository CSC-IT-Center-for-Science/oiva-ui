import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'

import Koulutusala from './Koulutusala'

import { parseLocalizedField } from "../../../../modules/helpers"
import { KOHTEET, KOODISTOT, LUPA_TEKSTIT } from '../modules/constants'
import { COLORS, FONT_STACK } from "../../../../modules/styles"

const SectionWrapper = styled.div`
  margin-left: 30px;
  position: relative;
  border-bottom: 1px solid ${COLORS.BORDER_GRAY};
  padding: 0 0 26px;
  
  &:last-child {
    border-bottom: none;
  }
`

const Span = styled.span`
  font-size: 20px;
  position: absolute;
  left: -30px;
`

const H3 = styled.h3`
  text-transform: uppercase;
  font-size: 20px;
`

const Capitalized = styled.span`
  text-transform: capitalize;
  margin-left: 30px;
`

const Bold = styled.span`
  font-family: ${FONT_STACK.GOTHAM_NARROW_BOLD};
`

const Section = (props) => {
  const { heading, target, maaraykset } = props

  if (maaraykset) {
    let alat = {}

    // kohdeid = 1: Erikoiskäsittely tutkinnoille ja koulutuksille
    if (Number(target) === KOHTEET.TUTKINNOT) {
      // Parsitaan aloittain
      _.forEach(maaraykset, (maarays) => {
        // Määritetään muuttujat
        const { koodi, ylaKoodit } = maarays
        const { koodiArvo, metadata } = koodi
        const tutkintoNimi = parseLocalizedField(metadata)

        // Määritetään määräyksissä olevat alat yläkoodeista
        _.forEach(ylaKoodit, (ylaKoodi) => {
          if (ylaKoodi.koodisto.koodistoUri === "isced2011koulutusalataso1") {
            const ylaKoodiKoodiArvo = ylaKoodi.koodiArvo
            const ylaKoodiMetadata = ylaKoodi.metadata
            const ylaKoodiKoulutusalaNimi = parseLocalizedField(ylaKoodiMetadata)

            // Tarkastetaan onko alat-objektissa jo koulutusalaa
            const ala = alat[ylaKoodiKoodiArvo]

            if (ala === undefined) {
              // Alaa ei ole alat-objektissa, lisätään se
              alat[ylaKoodiKoodiArvo] = { koodi: ylaKoodiKoodiArvo, nimi: ylaKoodiKoulutusalaNimi, tutkinnot: [{koodi: koodiArvo, nimi: tutkintoNimi}]}
            } else {
              // Ala oli jo alat-objektissa, lisätään tutkinto alan tutkintoihin
              ala.tutkinnot.push({ koodi: koodiArvo, nimi: tutkintoNimi })
            }
          }
        })
      })

      alat = _.sortBy(alat, ala => { return ala.koodi })

      // Palautetaan JSX
      return (
        <SectionWrapper>
          <Span>{`${target}.`}</Span><H3>{`${heading}`}</H3>
          <div>
            {_.map(alat, (ala, i) => {
              return <Koulutusala key={i} {...ala} />
            })}
          </div>
        </SectionWrapper>
      )

      // kohdeid = 2: Opetuskieli
    } else if (Number(target) === KOHTEET.KIELI) {

      return (
        <SectionWrapper>
          <Span>{`${target}.`}</Span><H3>{`${heading}`}</H3>
          <p>{LUPA_TEKSTIT.KIELI.VELVOLLISUUS_YKSIKKO.FI}</p>
          {_.map(maaraykset, (maarays, i) => {
            const { koodi } = maarays
            const { metadata } = koodi
            if (koodi && metadata) {
              const kieli = parseLocalizedField(metadata, 'FI', 'nimi', 'kieli')

              return (
                <div key={i}>
                  <Capitalized>{kieli}</Capitalized>
                </div>
              )
            }
          })}
        </SectionWrapper>
      )
      // kohdeid = 3: Toiminta-alueet
    } else if (Number(target) === KOHTEET.TOIMIALUE) {
      return (
        <SectionWrapper>
          <Span>{`${target}.`}</Span><H3>{`${heading}`}</H3>
          <p>{LUPA_TEKSTIT.TOIMINTA_ALUE.VELVOLLISUUS_MONIKKO.FI}</p>
          {_.map(maaraykset, (maarays, i) => {
            const { koodi } = maarays
            const { metadata } = koodi
            if (koodi && metadata) {
              const kunta = parseLocalizedField(metadata, 'FI', 'nimi', 'kieli')

              return (
                <div key={i}>
                  <Capitalized>{kunta}</Capitalized>
                </div>
              )
            }
          })}
        </SectionWrapper>
      )
    } else {
      return (
        <SectionWrapper>
          <Span>{`${target}.`}</Span><H3>{`${heading}`}</H3>
          <div>
            {maaraykset.map((maarays, i) => {
              if (maarays.koodi && maarays.kohde) {
                const { koodi } = maarays
                const { metadata } = koodi
                const kohdeId = maarays.kohde.id

                switch (kohdeId) {
                  // kohdeid = 4: Opiskelijavuodet → lukumäärä, joka kertoo luvan opiskelijavuosien lukumäärän. Voidaan asettaa minimi velvoitteena ja maksimi rajoitteena.
                  case KOHTEET.OPISKELIJAVUODET: {
                    if (koodi && metadata) {
                      const tyyppi = parseLocalizedField(metadata, 'FI', 'nimi', 'kieli')
                      const { arvo } = maarays

                      return (
                        <div key={i}>
                          <span>{tyyppi}: {arvo}</span>
                        </div>
                      )
                    }

                    break;
                  }

                  // kohdeid = 5: Muut määräykset→ ns. kaatoluokka kaikille muille määräyksille, jotka eivät sovi neljään ensimmäiseen kohteeseen.
                  case KOHTEET.MUUT: {
                    if (koodi && metadata) {

                      const type = parseLocalizedField(metadata, 'FI', 'nimi', 'kieli')
                      const desc = parseLocalizedField(metadata, 'FI', 'kuvaus', 'kieli')

                      return (
                        <div key={i}>
                          <h4><Bold>{type}</Bold></h4>
                          {desc ? <p>{desc}</p> : <p>Ei kuvausta saatavilla</p>}
                        </div>
                      )
                    }

                    break;
                  }

                  default: {
                    break;
                  }
                }
              }

              return null
            })}
          </div>
        </SectionWrapper>
      )
    }
  } else {
    return (
      <div>
        <h2>{`${target}. ${heading}`}</h2>
        <p>Ladataan...</p>
      </div>
    )
  }
}

export default Section
