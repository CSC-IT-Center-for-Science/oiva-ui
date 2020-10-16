import {
  mapObjIndexed,
  groupBy,
  prop,
  dissoc,
  head,
  map,
  find,
  propEq,
  path,
  startsWith,
  filter,
  compose,
  includes,
  flatten
} from "ramda";
import localforage from "localforage";
import { getLisatiedotFromStorage } from "../lisatiedot";

export const initializeMaarays = (tutkinto, maarays) => {
  return { ...tutkinto, maarays: head(dissoc("aliMaaraykset", maarays)) };
};

export const initializeOpetuskieli = ({
  koodiArvo: koodiarvo,
  koodisto,
  metadata,
  versio,
  voimassaAlkuPvm
}) => {
  return {
    koodiarvo,
    koodisto,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), metadata)),
    versio,
    voimassaAlkuPvm
  };
};

export const initializeOpetuskielet = (opetuskieletData, maaraykset = []) => {
  const maarayksetByOpetuskieli = groupBy(prop("koodiarvo"), maaraykset);
  return opetuskieletData
    ? map(opetuskielidata => {
        // Luodaan opetuskieli
        let opetuskieli = initializeOpetuskieli(opetuskielidata);

        // Asetetaan opetuskielelle määräys
        opetuskieli = initializeMaarays(
          opetuskieli,
          maarayksetByOpetuskieli[opetuskieli.koodiarvo]
        );

        return opetuskieli;
      }, opetuskieletData)
    : [];
};

export const defineBackendChangeObjects = async (changeObjects = [], maaraystyypit, locale, kohteet) => {
  const opetuskielet = await getkieletOPHFromStorage();
  const lisatiedot = await getLisatiedotFromStorage();
  const opetuskieletChangeObjs = filter(compose(startsWith("opetuskielet.opetuskieli"), prop("anchor")), changeObjects);

  /** Lisätietokentän käsittely */
  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects
  );

  const lisatiedotBeChangeObj = lisatiedotChangeObj ?
    {
      kohde: find(propEq("tunniste", "opetusjatutkintokieli"), kohteet),
      koodiarvo: lisatiedot[0].koodiarvo,
      koodisto: lisatiedot[0].koodisto.koodistoUri,
      kuvaus: path(["metadata", locale, "kuvaus"], lisatiedotChangeObj),
      maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
      meta: {
        arvo: path(["properties", "value"], lisatiedotChangeObj),
        changeObjects: [lisatiedotChangeObj]
      },
      tila: "LISAYS" } : [];

  /** Opetuskielten käsittely */
  const opetuskieliBeChangeObjects = map(opetuskieli => {
    const changeObj = find(cObj => find(kieli => kieli.value === opetuskieli.koodiarvo, cObj.properties.value), opetuskieletChangeObjs);

    return changeObj ? {
      generatedId: `opetuskielet-${Math.random()}`,
      kohde: find(propEq("tunniste", "opetusjatutkintokieli"), kohteet),
      koodiarvo: opetuskieli.koodiarvo,
      koodisto: opetuskieli.koodisto.koodistoUri,
      kuvaus: path(["metadata", locale, "kuvaus"], changeObj),
      maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
      meta: {
        changeObjects: [changeObj]
      },
      tila: "LISAYS"
    } : null
  }, opetuskielet);

  return flatten([opetuskieliBeChangeObjects, lisatiedotBeChangeObj]).filter(Boolean);

}

export function getkieletOPHFromStorage() {
  return localforage.getItem("kieletOPH");
}
