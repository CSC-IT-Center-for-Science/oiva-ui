import {
  append,
  mapObjIndexed,
  groupBy,
  prop,
  head,
  omit,
  map,
  sort,
  find,
  compose,
  endsWith,
  propEq,
  path,
  includes,
  flatten
} from "ramda";
import localforage from "localforage";
import { __ } from "i18n-for-browser";

export const initializeOpetuksenJarjestamismuoto = muoto => {
  return omit(["koodiArvo"], {
    ...muoto,
    koodiarvo: muoto.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), muoto.metadata))
  });
};

export const initializeOpetuksenJarjestamismuodot = muodot => {
  return sort(
    (a, b) => {
      const aInt = parseInt(a.koodiarvo, 10);
      const bInt = parseInt(b.koodiarvo, 10);
      if (aInt < bInt) {
        return -1;
      } else if (aInt > bInt) {
        return 1;
      }
      return 0;
    },
    map(muoto => {
      return initializeOpetuksenJarjestamismuoto(muoto);
    }, muodot)
  );
};

export const defineBackendChangeObjects = async (
  changeObjects = [],
  maaraystyypit,
  locale,
  kohteet
) => {
  const opetuksenJarjestamismuodot = await getOpetuksenJarjestamismuodotFromStorage();

  const kohde = find(propEq("tunniste", "tutkinnotjakoulutukset"), kohteet); // TODO: Onko oikea kohde?
  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);

  const opetuksenJarjestamismuotoChangeObjs = map(
    jarjestamismuoto => {
      const changeObj = find(
        compose(
          endsWith(`${jarjestamismuoto.koodiarvo}.valinta`),
          prop("anchor")
        ),
        changeObjects
      );
      const kuvausChangeObj = find(
        compose(
          endsWith(`${jarjestamismuoto.koodiarvo}.kuvaus.A`),
          prop("anchor")
        ),
        changeObjects
      );

      return changeObj
        ? {
            generatedId: `opetuksenJarjestamismuoto-${Math.random()}`,
            kohde,
            koodiarvo: jarjestamismuoto.koodiarvo,
            koodisto: jarjestamismuoto.koodisto.koodistoUri,
            kuvaus: changeObj.properties.value,
            maaraystyyppi,
            meta: {
              changeObjects: [changeObj, kuvausChangeObj].filter(Boolean),
              kuvaus: changeObj.properties.value
            },
            tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
          }
        : null;
    },
    append(
      {
        koodiarvo: 0,
        koodisto: { koodistoUri: "opetuksenjarjestamismuoto" },
        kuvaus: __("education.eiSisaOppilaitosTaiKotikoulumuotoinen")
      },
      opetuksenJarjestamismuodot
    )
  ).filter(Boolean);

  /**
   * Lisätiedot-kenttä tulee voida tallentaa ilman, että osioon on tehty muita
   * muutoksia. Siksi kentän tiedoista luodaan tässä kohtaa oma backend-
   * muotoinen muutosobjekti.
   */
  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects
  );

  const lisatiedotBEchangeObject = lisatiedotChangeObj
    ? {
        arvo: path(["properties", "value"], lisatiedotChangeObj),
        kohde,
        koodiarvo: path(
          ["properties", "metadata", "koodiarvo"],
          lisatiedotChangeObj
        ),
        koodisto: path(
          ["properties", "metadata", "koodisto", "koodistoUri"],
          lisatiedotChangeObj
        ),
        maaraystyyppi,
        meta: {
          changeObjects: [lisatiedotChangeObj]
        },
        tila: "LISAYS"
      }
    : null;

  return flatten([
    opetuksenJarjestamismuotoChangeObjs,
    lisatiedotBEchangeObject
  ]).filter(Boolean);
};

export function getOpetuksenJarjestamismuodotFromStorage() {
  return localforage.getItem("opetuksenJarjestamismuodot");
}